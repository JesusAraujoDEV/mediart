const axios = require('axios');
const { config } = require('../../config/config');

class RawgApiService {
    constructor() {
        this.apiKey = config.apiKeys.rawgApiKey;
        this.baseUrl = 'https://api.rawg.io/api';
    }

    async search(query) {
        try {
            if (!this.apiKey) {
                console.error('RAWG API key not configured.');
                throw new Error('RAWG API key missing.');
            }

            // RAWG search endpoint: GET /games?search=query&key=API_KEY&page_size=50
            const response = await axios.get(`${this.baseUrl}/games`, {
                params: {
                    search: query,
                    key: this.apiKey,
                    page_size: 50 // Similar to IGDB's limit 50
                }
            });

            const gamesData = response.data.results || [];


            // Filter out DLCs, bundles, etc. (RAWG doesn't have explicit categories like IGDB)
            // We'll filter based on name patterns and check if it's a main game
            const droppedPattern = /\b(DLC|Pack|Episode|Bundle|Season Pass|Expansion|Add-on)\b/i;
            const filteredData = gamesData.filter(game => {
                const title = String(game.name || '');
                if (droppedPattern.test(title)) return false;
                // RAWG has 'parent_platforms' but for simplicity, keep all for now
                return true;
            });


            const videogames = filteredData.map(game => {
                return {
                    title: game.name || 'N/A',
                    type: 'videogame',
                    description: game.description || 'No description available.',
                    coverUrl: game.background_image || null,
                    releaseDate: game.released || null,
                    externalId: String(game.id),
                    externalSource: 'RAWG',
                    avgRating: game.rating ? parseFloat(game.rating.toFixed(1)) : null,
                    externalUrl: game.website || (game.slug ? `https://rawg.io/games/${game.slug}` : null),
                    genres: game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A',
                    platforms: game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A',
                    totalRatingCount: game.ratings_count || 0
                };
            });


            // Sort by rating and ratings_count, similar to IGDB
            videogames.sort((a, b) => {
                const scoreA = (a.avgRating || 0) * 10 + (a.totalRatingCount || 0) * 0.02;
                const scoreB = (b.avgRating || 0) * 10 + (b.totalRatingCount || 0) * 0.02;
                return scoreB - scoreA;
            });


            // Remove internal fields like genres and platforms arrays, keep only strings
            const cleanedVideogames = videogames.map(({ genres, platforms, ...rest }) => rest);


            return cleanedVideogames;

        } catch (error) {
            console.error('Error searching RAWG:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = RawgApiService;