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
        if (item.media_type === 'movie') {
          movies.push({
            id: item.id,
            title: item.title,
            release_date: item.release_date,
            overview: item.overview,
            poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            backdrop_url: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
            vote_average: item.vote_average,
            popularity: item.popularity, // <-- Añadir popularidad aquí
            external_url: `https://www.themoviedb.org/movie/${item.id}`
          });
        } else if (item.media_type === 'tv') {
          tvshows.push({
            id: item.id,
            title: item.name, // En series es 'name'
            first_air_date: item.first_air_date,
            overview: item.overview,
            poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            backdrop_url: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
            vote_average: item.vote_average,
            popularity: item.popularity, // <-- Añadir popularidad aquí
            external_url: `https://www.themoviedb.org/tv/${item.id}`
          });
        }
      });

      // ¡AQUÍ ESTÁ LA LÓGICA DE ORDENAMIENTO!
      // Ordenar películas por popularidad de mayor a menor
      movies.sort((a, b) => b.popularity - a.popularity);
      // Ordenar series de TV por popularidad de mayor a menor
      tvshows.sort((a, b) => b.popularity - a.popularity);

      return { movies, tvshows };

    } catch (error) {
      console.error('Error searching TMDB:', error.response ? error.response.data : error.message);
      return { movies: [], tvshows: [] };
    }
  }
}

module.exports = TmdbApiService;