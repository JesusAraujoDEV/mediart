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

            const response = await axios.post(`${this.baseUrl}/games`,
                `search "${query}"; fields name, summary, cover.url, first_release_date, genres.name, platforms.name, slug, aggregated_rating, total_rating_count, url; limit 50;`, // Increased limit to 50
                {
                    headers: {
                        'Client-ID': this.clientId,
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'text/plain'
                    }
                }
            );

            const gamesData = response.data;

            // Log raw data from IGDB for debugging purposes
            if (gamesData.length === 0) {
                console.log(`No results found from IGDB for query: "${query}"`);
            } else {
                console.log(`Received ${gamesData.length} results from IGDB for query: "${query}"`);
                // console.log('Raw IGDB data for first item:', gamesData[0]); // Uncomment for detailed debugging
            }


            const videogames = gamesData.map(game => {
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

            videogames.sort((a, b) => {
                const countA = a.totalRatingCount || 0;
                const countB = b.totalRatingCount || 0;
                const ratingA = a.avgRating || 0;
                const ratingB = b.avgRating || 0;

                if (countB === countA) {
                    return ratingB - ratingA;
                }
                return countB - countA;
            });

            const cleanedVideogames = videogames.map(({ genres, platforms, totalRatingCount, ...rest }) => rest);

            console.log('Processed and sorted videogames (cleaned):', cleanedVideogames);
            return cleanedVideogames;

        } catch (error) {
            console.error('Error searching IGDB:', error.response ? error.response.data : error.message);
            // It's good practice to re-throw the error so the calling service (SearchService) can handle it
            throw error;
        }
    }
}

module.exports = IgdbApiService;