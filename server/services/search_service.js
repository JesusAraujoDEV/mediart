// services/search_service.js
const TmdbApiService = require('./api/tmdb_api_service');
const SpotifyApiService = require('./api/spotify_api_service');
const GoogleBooksApiService = require('./api/googlebooks_api_service');
const IgdbApiService = require('./api/igdb_api_service');
const UserService = require('./user_service'); // <-- ¡NUEVA IMPORTACIÓN!
const { Op } = require('sequelize'); // Para usar operadores como LIKE

class SearchService {
  constructor() {
    this.tmdbApiService = new TmdbApiService();
    this.spotifyApiService = new SpotifyApiService();
    this.googleBooksApiService = new GoogleBooksApiService();
    this.igdbApiService = new IgdbApiService();
    this.userService = new UserService();
  }

  async searchAll(query) {
    const [tmdbResult, spotifyResult, googleBooksResult, igdbResult] = await Promise.allSettled([
      this.tmdbApiService.search(query),
      this.spotifyApiService.search(query),
      this.googleBooksApiService.search(query),
      this.igdbApiService.search(query)
    ]);

    const movies = tmdbResult.status === 'fulfilled' ? tmdbResult.value.movies : [];
    const tvshows = tmdbResult.status === 'fulfilled' ? tmdbResult.value.tvshows : [];
    const songs = spotifyResult.status === 'fulfilled' ? spotifyResult.value.songs : [];
    const artists = spotifyResult.status === 'fulfilled' ? spotifyResult.value.artists : [];
    const albums = spotifyResult.status === 'fulfilled' ? spotifyResult.value.albums : [];
    const books = googleBooksResult.status === 'fulfilled' ? googleBooksResult.value : [];
    const videogames = igdbResult.status === 'fulfilled' ? igdbResult.value : [];

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

  async searchUsersByUsername(query) {
    try {
      // Usamos el método find de UserService, pero le pasamos opciones de búsqueda
      // para filtrar por username que contenga la query.
      const users = await this.userService.find({
        where: {
          username: {
            [Op.iLike]: `%${query}%` // iLike para búsqueda insensible a mayúsculas/minúsculas
          }
        },
        attributes: { exclude: ['passwordHash', 'recoveryToken'] } // Excluir campos sensibles
      });
      return users;
    } catch (error) {
      console.error('Error in searchUsersByUsername:', error);
      throw error; // O return []; si prefieres no propagar el error.
    }
  }

}

module.exports = SearchService;