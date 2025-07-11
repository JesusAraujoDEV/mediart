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
        // Ejecutar todas las búsquedas en paralelo.
        // Los servicios ahora retornan directamente un array plano de Items unificados.
        const [tmdbPromise, spotifyPromise, googleBooksPromise, igdbPromise] = await Promise.allSettled([
            this.tmdbApiService.search(query),
            this.spotifyApiService.search(query),
            this.googleBooksApiService.search(query), // ASUME que ya devuelve el formato unificado
            this.igdbApiService.search(query) // ASUME que ya devuelve el formato unificado
        ]);

        let allResults = [];

        // Concatenar los resultados si la promesa fue fulfilled
        if (tmdbPromise.status === 'fulfilled' && Array.isArray(tmdbPromise.value)) {
            allResults = allResults.concat(tmdbPromise.value);
        } else if (tmdbPromise.status === 'rejected') {
            console.error('Error fetching from TMDB:', tmdbPromise.reason);
        }

        if (spotifyPromise.status === 'fulfilled' && Array.isArray(spotifyPromise.value)) {
            allResults = allResults.concat(spotifyPromise.value);
        } else if (spotifyPromise.status === 'rejected') {
            console.error('Error fetching from Spotify:', spotifyPromise.reason);
        }

        if (googleBooksPromise.status === 'fulfilled' && Array.isArray(googleBooksPromise.value)) {
            allResults = allResults.concat(googleBooksPromise.value);
        } else if (googleBooksPromise.status === 'rejected') {
            console.error('Error fetching from Google Books:', googleBooksPromise.reason);
        }

        if (igdbPromise.status === 'fulfilled' && Array.isArray(igdbPromise.value)) {
            allResults = allResults.concat(igdbPromise.value);
        } else if (igdbPromise.status === 'rejected') {
            console.error('Error fetching from IGDB:', igdbPromise.reason);
        }

        // Opcional: Ordenar todos los resultados combinados
        // Podrías ordenar por avgRating si está disponible, o por algún otro criterio.
        // Si no todos los items tienen avgRating, necesitas una lógica para manejarlos (ej. poner los nulos al final).
        allResults.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));


        return allResults; // Ahora devuelve un único array de objetos ItemSchema
    }

    /**
     * Busca películas y series de TV en TMDB.
     * Ahora devuelve un array plano de Items unificados.
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async searchTmdb(query) {
        try {
            const result = await this.tmdbApiService.search(query);
            return result; // tmdbApiService.search ya devuelve el array plano
        } catch (error) {
            console.error('Error in searchTmdb:', error);
            return [];
        }
    }

    /**
     * Busca canciones, artistas y álbumes en Spotify.
     * Ahora devuelve un array plano de Items unificados.
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async searchSpotify(query) {
        try {
            const result = await this.spotifyApiService.search(query);
            return result; // spotifyApiService.search ya devuelve el array plano
        } catch (error) {
            console.error('Error in searchSpotify:', error);
            return [];
        }
    }

    /**
     * Busca libros en Google Books.
     * ASUME que googleBooksApiService.search ya devuelve el array plano.
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async searchGoogleBooks(query) {
        try {
            const result = await this.googleBooksApiService.search(query);
            return result || []; // Asegurarse de que sea un array
        } catch (error) {
            console.error('Error in searchGoogleBooks:', error);
            return [];
        }
    }

    /**
     * Busca videojuegos en IGDB.
     * ASUME que igdbApiService.search ya devuelve el array plano.
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async searchIgdb(query) {
        try {
            const result = await this.igdbApiService.search(query);
            return result || []; // Asegurarse de que sea un array
        } catch (error) {
            console.error('Error in searchIgdb:', error);
            return [];
        }
    }

    async searchUsersByUsername(query) {
        try {
            const users = await this.userService.find({
                where: {
                    username: {
                        [Op.iLike]: `%${query}%`
                    }
                },
                attributes: { exclude: ['passwordHash', 'recoveryToken'] }
            });
            return users;
        } catch (error) {
            console.error('Error in searchUsersByUsername:', error);
            throw error;
        }
    }
}

module.exports = SearchService;