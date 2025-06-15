const tmdbApiService = require('./api/tmdb_api_service');
// const googleBooksApiService = require('./googlebooks_api_service');
const spotifyApiService = require('./api/spotify_api_service');
// const igdbApiService = require('./igdb_api_service');

class SearchService {
  constructor() {
    this.tmdbService = new tmdbApiService();
    // this.googleBooksService = new googleBooksApiService();
    this.spotifyService = new spotifyApiService(); // Instancia de Spotify
    // this.igdbService = new igdbApiService();
  }

  async searchAll(query) {
    const [
      tmdbResult,
      // googleBooksResult,
      spotifyResult,
      // igdbResult
    ] = await Promise.allSettled([
      this.tmdbService.search(query),
      // this.googleBooksService.search(query),
      this.spotifyService.search(query),
      // this.igdbService.search(query)
    ]);

    // Recolectar y formatear los resultados
    const results = {
      songs: spotifyResult.status === 'fulfilled' ? spotifyResult.value.songs : [],
      artists: spotifyResult.status === 'fulfilled' ? spotifyResult.value.artists : [],
      albums: spotifyResult.status === 'fulfilled' ? spotifyResult.value.albums : [],
      movies: tmdbResult.status === 'fulfilled' ? tmdbResult.value.movies : [],
      tvshows: tmdbResult.status === 'fulfilled' ? tmdbResult.value.tvshows : [],
      books: [],
      videogames: []
    };

    return results;
  }
}

module.exports = SearchService;