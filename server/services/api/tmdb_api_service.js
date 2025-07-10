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
            // Retorna un objeto con arrays vacíos como lo tenías antes
            // para mantener la compatibilidad con el retorno original si es necesario,
            // pero los arrays internos ahora contendrán el formato unificado.
            return { movies: [], tvshows: [] };
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

            const movies = [];
            const tvshows = [];

            data.forEach(item => {
                // Mapear los datos de TMDB al formato de tu ItemSchema
                // No incluir 'popularity' en el objeto final si no está en ItemSchema
                // y se usa solo para el ordenamiento interno.

                if (item.media_type === 'movie') {
                    movies.push({
                        // Propiedades de ItemSchema
                        // id: Sequelize generará su propio ID, así que este 'id' de TMDB no es el de tu DB.
                        // Usaremos externalId para el ID de la API externa.
                        title: item.title,
                        type: 'movie', // Coincide con tu columna 'type'
                        description: item.overview,
                        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                        releaseDate: item.release_date, // Coincide con 'releaseDate'
                        externalId: item.id.toString(), // ID de TMDB, guardado como string
                        externalSource: 'TMDB', // Coincide con 'externalSource'
                        avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0, // Asegura tipo DECIMAL, valor por defecto 0
                        externalUrl: `https://www.themoviedb.org/movie/${item.id}`, // Nueva columna en tu schema
                        // popularity: item.popularity // Mantener temporalmente para el ordenamiento
                    });
                } else if (item.media_type === 'tv') {
                    tvshows.push({
                        // Propiedades de ItemSchema
                        title: item.name, // En series es 'name'
                        type: 'tvshow', // Coincide con tu columna 'type'
                        description: item.overview,
                        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                        releaseDate: item.first_air_date,
                        externalId: item.id.toString(),
                        externalSource: 'TMDB',
                        avgRating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                        externalUrl: `https://www.themoviedb.org/tv/${item.id}`,
                        // popularity: item.popularity // Mantener temporalmente para el ordenamiento
                    });
                }
            });

            // Lógica de ordenamiento original (si sigues queriendo ordenar por popularidad ANTES de retornar)
            // Asegúrate de que 'popularity' esté presente en los objetos para este paso.
            movies.sort((a, b) => b.popularity - a.popularity); // Si popularity no está en el objeto final, deberías añadirla temporalmente en el push.
            tvshows.sort((a, b) => b.popularity - a.popularity);

            // Eliminar la propiedad 'popularity' si no es parte de tu ItemSchema final
            const cleanedMovies = movies.map(({ popularity, ...rest }) => rest);
            const cleanedTvshows = tvshows.map(({ popularity, ...rest }) => rest);

            return { movies: cleanedMovies, tvshows: cleanedTvshows };

        } catch (error) {
            console.error('Error searching TMDB:', error.response ? error.response.data : error.message);
            return { movies: [], tvshows: [] };
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
                externalUrl: `https://www.themoviedb.org/movie/${item.id}`
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