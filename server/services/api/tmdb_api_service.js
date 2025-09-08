// services/tmdb_api_service.js
const axios = require('axios');
const { config } = require('./../../config/config');

class TmdbApiService {
    constructor() {
        this.apiKey = config.apiKeys.tmdb;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async search(query) {
        if (!this.apiKey) {
            console.error('TMDB API Key not configured.');
            return []; // Devuelve un array vacío si no hay API Key
        }

        try {
            const response = await axios.get(`${this.baseUrl}/search/multi`, {
                params: {
                    api_key: this.apiKey,
                    query: query,
                    language: 'es-MX'
                }
            });

            const data = response.data.results;
            let allItems = []; // Aquí acumularemos todas las películas y series

            data.forEach(item => {
                // Solo procesamos 'movie' y 'tv' del multi-search
                if (item.media_type === 'movie') {
                    allItems.push({
                        title: item.title,
                        type: 'movie', // Ya es el tipo correcto 'movie'
                        description: item.overview,
                        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                        releaseDate: item.release_date,
                        externalId: String(item.id),
                        externalSource: 'TMDB',
                        avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                        externalUrl: `https://www.themoviedb.org/movie/${item.id}`,
                    });
                } else if (item.media_type === 'tv') {
                    allItems.push({
                        title: item.name,
                        type: 'tvshow', // Ya es el tipo correcto 'tvshow'
                        description: item.overview,
                        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                        releaseDate: item.first_air_date,
                        externalId: String(item.id),
                        externalSource: 'TMDB',
                        avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                        externalUrl: `https://www.themoviedb.org/tv/${item.id}`,
                    });
                }
                // Si quieres incluir 'person' o otros tipos, puedes hacerlo aquí también,
                // mapeándolos a tu ItemSchema.
            });

            // Opcional: ordenar los resultados combinados por popularidad si deseas una priorización.
            // allItems.sort((a, b) => b.popularity - a.popularity); // Asegúrate de que 'popularity' esté presente en los objetos si la usas aquí.

            return allItems; // ¡Ahora devuelve un array plano!

        } catch (error) {
            console.error('Error searching TMDB:', error.response ? error.response.data : error.message);
            throw error; // Es mejor lanzar el error para que el servicio superior lo capture
        }
    }

    // Si también tienes métodos para obtener detalles de un solo ítem, deberías adaptarlos
    // para que retornen el mismo formato de ItemSchema.
    async getMovieDetails(tmdbId) {
        if (!this.apiKey) {
            console.error('TMDB API Key not configured.');
            return null;
        }
        try {
            const response = await axios.get(`${this.baseUrl}/movie/${tmdbId}`, {
                params: { api_key: this.apiKey, language: 'es-MX' }
            });
            const item = response.data;
            return {
                title: item.title,
                type: 'movie',
                description: item.overview,
                coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                releaseDate: item.release_date,
                externalId: item.id.toString(),
                externalSource: 'TMDB',
                avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                externalUrl: `https://www.themoviedb.org/movie/${item.id}`,
                genre_ids: item.genres ? item.genres.map(g => g.id) : []
            };
        } catch (error) {
            console.error(`Error fetching TMDB movie details for ID ${tmdbId}:`, error.response ? error.response.data : error.message);
            return null;
        }
    }

    async getTvShowDetails(tmdbId) {
        if (!this.apiKey) {
            console.error('TMDB API Key not configured.');
            return null;
        }
        try {
            const response = await axios.get(`${this.baseUrl}/tv/${tmdbId}`, {
                params: { api_key: this.apiKey, language: 'es-MX' }
            });
            const item = response.data;
            return {
                title: item.name,
                type: 'tvshow',
                description: item.overview,
                coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                releaseDate: item.first_air_date,
                externalId: item.id.toString(),
                externalSource: 'TMDB',
                avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                externalUrl: `https://www.themoviedb.org/tv/${item.id}`
            };
        } catch (error) {
            console.error(`Error fetching TMDB TV show details for ID ${tmdbId}:`, error.response ? error.response.data : error.message);
            return null;
        }
    }
}

module.exports = TmdbApiService;