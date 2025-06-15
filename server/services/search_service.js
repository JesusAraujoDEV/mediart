const tmdbApiService = require('./api/tmdb_api_service');
const googleBooksApiService = require('./api/googlebooks_api_service');
const spotifyApiService = require('./api/spotify_api_service');
const igdbApiService = require('./api/igdb_api_service');

class SearchService {
  constructor() {
    this.tmdbService = new tmdbApiService();
    this.googleBooksService = new googleBooksApiService();
    this.spotifyService = new spotifyApiService();
    this.igdbService = new igdbApiService();
  }

  async searchAll(query) {
    const [
      tmdbResult,
      googleBooksResult,
      spotifyResult,
      igdbResult
    ] = await Promise.allSettled([
      this.tmdbService.search(query),
      this.googleBooksService.search(query),
      this.spotifyService.search(query),
      this.igdbService.search(query)
    ]);

    const results = {
      songs: spotifyResult.status === 'fulfilled' ? spotifyResult.value.songs : [],
      artists: spotifyResult.status === 'fulfilled' ? spotifyResult.value.artists : [],
      albums: spotifyResult.status === 'fulfilled' ? spotifyResult.value.albums : [],
      movies: tmdbResult.status === 'fulfilled' ? tmdbResult.value.movies : [],
      tvshows: tmdbResult.status === 'fulfilled' ? tmdbResult.value.tvshows : [],
      books: googleBooksResult.status === 'fulfilled' ? googleBooksResult.value.books : [],
      videogames: igdbResult.status === 'fulfilled' ? igdbResult.value.videogames : []
    };

    return results;
  }
}

module.exports = SearchService;