const axios = require('axios');
const { config } = require('../../config/config');

class IgdbApiService {
    constructor() {
        this.clientId = config.apiKeys.igdbClientId;
        this.clientSecret = config.apiKeys.igdbClientSecret;
        this.accessToken = null;
        this.tokenExpiry = 0;
        this.baseUrl = 'https://api.igdb.com/v4';
    }

    async #authenticate() {
        // Authenticate only if token is missing or expired (with a 1-minute buffer)
        if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
            return;
        }

        if (!this.clientId || !this.clientSecret) {
            console.error('IGDB Client ID or Client Secret not configured.');
            throw new Error('IGDB authentication credentials missing.');
        }

        try {
            const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: 'client_credentials'
                }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000); // expires_in is in seconds
            console.log('IGDB/Twitch access token obtained/refreshed successfully.');

        } catch (error) {
            console.error('Error obtaining/refreshed IGDB/Twitch access token:', error.response ? error.response.data : error.message);
            throw new Error('Could not authenticate with IGDB/Twitch API');
        }
    }

    async search(query) {
        try {
            await this.#authenticate();

            if (!this.accessToken) {
                throw new Error('IGDB access token not available. Authentication failed.');
            }

            // Build a stricter IGDB query:
            // - Prefer base/standalone games (category 0 main_game, 8 remaster allowed?, 9 expanded_game, 10 port, 11 fork, 5 standalone_expansion)
            // - Exclude DLC/expansion/episode/bundle
            // - Fetch useful fields
            // Note: IGDB categories reference:
            // 0 Main game, 1 DLC/addon, 2 Expansion, 3 Bundle, 4 Standalone expansion (old), 5 Mod, 6 Episode, 8 Remaster, 9 Expanded Game, 10 Port, 11 Fork
            // We'll include [0,8,9,10,11] and exclude 1,2,3,6.
            const igdbQuery = [
                `search "${query}";`,
                'fields name, summary, cover.url, first_release_date, genres.name, platforms.name, slug, aggregated_rating, total_rating_count, url, category, version_title, version_parent;',
                'where (category = 0 | category = 8 | category = 9 | category = 10 | category = 11)',
                ' & version_parent = null',
                ' & (version_title = null | version_title = "");',
                'limit 50;'
            ].join(' ');
            const response = await axios.post(`${this.baseUrl}/games`, igdbQuery, {
                headers: {
                    'Client-ID': this.clientId,
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'text/plain'
                }
            });

            const gamesData = response.data;

            // Debug logs gated by env flag
            const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
            if (debug) {
                if (gamesData.length === 0) {
                    console.log(`IGDB: 0 results for "${query}"`);
                } else {
                    const sample = gamesData.slice(0, 3).map(g => g.name);
                    console.log(`IGDB: ${gamesData.length} results for "${query}" (sample: ${sample.join(', ')})`);
                }
            }


            // Post-filter to drop noisy entries (DLC, bundles, episodes, character packs)
            const droppedPattern = /\b(DLC|Pack|Episode|Bundle|Season Pass|Character Pack)\b/i;
            const legoPattern = /\blego\b/i; // optionally de-prioritize LEGO noise
            const filteredData = gamesData.filter(g => {
                const title = String(g.name || '');
                if (droppedPattern.test(title)) return false;
                // Keep LEGO but allow ranking to push them down later; do not drop here.
                return true;
            });

            const videogames = filteredData.map(game => {
                let coverUrl = null;
                if (game.cover && game.cover.url) {
                    coverUrl = `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`;
                }

                return {
                    title: game.name || 'N/A',
                    type: 'videogame',
                    description: game.summary || 'No summary available.',
                    coverUrl: coverUrl,
                    releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
                    externalId: String(game.id),
                    externalSource: 'IGDB',
                    avgRating: game.aggregated_rating ? parseFloat(game.aggregated_rating.toFixed(1)) : null,
                    externalUrl: game.url || (game.slug ? `https://www.igdb.com/games/${game.slug}` : null),
                    genres: game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A',
                    platforms: game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A',
                    totalRatingCount: game.total_rating_count || 0 // Used for popularity sorting
                };
            });

            // Relevance score: popularity + rating + keyword boosts for team/cosmic/science vibes
            const boostKeywords = [
                'team','squad','co-op','cooperative','ensemble','family',
                'cosmic','space','galaxy','interstellar','science','scientist','exploration'
            ];
            function score(item) {
                const count = item.totalRatingCount || 0;
                const rating = item.avgRating || 0;
                const desc = `${item.title || ''} ${item.description || ''}`.toLowerCase();
                let boost = 0;
                for (const kw of boostKeywords) {
                    if (desc.includes(kw)) boost += 1.5;
                }
                // Slight penalty to LEGO to reduce DLC/noise prominence while still allowing
                if ((item.title || '').toLowerCase().includes('lego')) boost -= 1.0;
                return (count * 0.02) + (rating * 1.0) + boost;
            }

            videogames.sort((a, b) => {
                const sa = score(a);
                const sb = score(b);
                if (sb === sa) {
                    // tie-breaker: higher rating then higher count
                    const ratingA = a.avgRating || 0;
                    const ratingB = b.avgRating || 0;
                    if (ratingB === ratingA) {
                        const countA = a.totalRatingCount || 0;
                        const countB = b.totalRatingCount || 0;
                        return countB - countA;
                    }
                    return ratingB - ratingA;
                }
                return sb - sa;

                if (countB === countA) {
                    return ratingB - ratingA;
                }
                return countB - countA;
            });

            const cleanedVideogames = videogames.map(({ genres, platforms, totalRatingCount, ...rest }) => rest);

            if (debug) {
                const sample = cleanedVideogames.slice(0, 5).map(v => v.title);
                console.log('IGDB cleaned top:', sample);
            }
            return cleanedVideogames;

        } catch (error) {
            console.error('Error searching IGDB:', error.response ? error.response.data : error.message);
            // It's good practice to re-throw the error so the calling service (SearchService) can handle it
            throw error;
        }
    }
}

module.exports = IgdbApiService;