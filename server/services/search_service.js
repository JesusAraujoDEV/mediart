// services/search_service.js
const TmdbApiService = require('./api/tmdb_api_service');
const SpotifyApiService = require('./api/spotify_api_service');
const GoogleBooksApiService = require('./api/googlebooks_api_service');
const IgdbApiService = require('./api/igdb_api_service');

class SearchService {
  constructor() {
    this.tmdbApiService = new TmdbApiService();
    this.spotifyApiService = new SpotifyApiService();
    this.googleBooksApiService = new GoogleBooksApiService();
    this.igdbApiService = new IgdbApiService();
  }

  /**
   * Realiza una búsqueda en todas las APIs configuradas para diferentes tipos de contenido.
   * Utilizado principalmente para la búsqueda inicial del "item base".
   * @param {string} query La cadena de búsqueda.
   * @returns {Promise<Object>} Un objeto con arrays de movies, tvshows, songs, books, videogames, artists, albums.
   */
  async searchAll(query) {
    const [tmdbResult, spotifyResult, googleBooksResult, igdbResult] = await Promise.allSettled([
      this.tmdbApiService.search(query), // Debería devolver { movies: [], tvshows: [], genres: [] } si los obtuviste
      this.spotifyApiService.search(query), // Debería devolver { songs: [], artists: [], albums: [] }
      this.googleBooksApiService.search(query),
      this.igdbApiService.search(query)
    ]);

    // Procesar los resultados de Promise.allSettled
    const movies = tmdbResult.status === 'fulfilled' ? tmdbResult.value.movies : [];
    const tvshows = tmdbResult.status === 'fulfilled' ? tmdbResult.value.tvshows : [];
    // Nota: Si TmdbApiService.search() también devuelve géneros, deberías manejarlos aquí
    // const tmdbGenres = tmdbResult.status === 'fulfilled' ? tmdbResult.value.genres : [];


    const songs = spotifyResult.status === 'fulfilled' ? spotifyResult.value.songs : [];
    const artists = spotifyResult.status === 'fulfilled' ? spotifyResult.value.artists : [];
    const albums = spotifyResult.status === 'fulfilled' ? spotifyResult.value.albums : [];

    const books = googleBooksResult.status === 'fulfilled' ? googleBooksResult.value : []; // Google Books api puede devolver directamente un array
    const videogames = igdbResult.status === 'fulfilled' ? igdbResult.value : []; // IGDB api puede devolver directamente un array

    return {
      movies,
      tvshows,
      songs,
      artists,
      albums,
      books,
      videogames
    };
  }

  /**
   * Busca películas y series de TV en TMDB.
   * @param {string} query
   * @returns {Promise<{movies: Array, tvshows: Array}>}
   */
  async searchTmdb(query) {
    try {
      const result = await this.tmdbApiService.search(query);
      return {
        movies: result.movies || [],
        tvshows: result.tvshows || []
      };
    } catch (error) {
      console.error('Error in searchTmdb:', error);
      return { movies: [], tvshows: [] };
    }
  }

  /**
   * Busca canciones, artistas y álbumes en Spotify.
   * @param {string} query
   * @returns {Promise<{songs: Array, artists: Array, albums: Array}>}
   */
  async searchSpotify(query) {
    try {
      const result = await this.spotifyApiService.search(query);
      return {
        songs: result.songs || [],
        artists: result.artists || [],
        albums: result.albums || []
      };
    } catch (error) {
      console.error('Error in searchSpotify:', error);
      return { songs: [], artists: [], albums: [] };
    }
  }

  /**
   * Busca libros en Google Books.
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchGoogleBooks(query) {
    try {
      const result = await this.googleBooksApiService.search(query);
      return result || [];
    } catch (error) {
      console.error('Error in searchGoogleBooks:', error);
      return [];
    }
  }

  /**
   * Busca videojuegos en IGDB.
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchIgdb(query) {
    try {
      const result = await this.igdbApiService.search(query);
      return result || [];
    } catch (error) {
      console.error('Error in searchIgdb:', error);
      return [];
    }
  }
}

module.exports = SearchService;