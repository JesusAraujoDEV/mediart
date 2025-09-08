// services/search_service.js
const TmdbApiService = require('./api/tmdb_api_service');
const SpotifyApiService = require('./api/spotify_api_service');
const GoogleBooksApiService = require('./api/googlebooks_api_service');
const IgdbApiService = require('./api/igdb_api_service');
const RawgApiService = require('./api/rawg_api_service');
const UserService = require('./user_service');
const { Op } = require('sequelize');

class SearchService {
    constructor() {
        this.tmdbApiService = new TmdbApiService();
        this.spotifyApiService = new SpotifyApiService();
        this.googleBooksApiService = new GoogleBooksApiService();
        this.igdbApiService = new IgdbApiService();
        this.rawgApiService = new RawgApiService();
        this.userService = new UserService();
    }

    async searchAll(query) {
        // Ejecutar todas las búsquedas en paralelo.
        // Los servicios ahora retornan directamente un array plano de Items unificados.
        const [tmdbPromise, spotifyPromise, googleBooksPromise, igdbPromise] = await Promise.allSettled([
            this.tmdbApiService.search(query),
            this.spotifyApiService.search(query),
            this.googleBooksApiService.search(query),
            this.igdbApiService.search(query)
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
     * Busca en Spotify, opcionalmente por un tipo específico (track, artist, album).
     * @param {string} query
     * @param {string} [typeHint] - Opcional. 'track', 'artist', o 'album' para buscar solo ese tipo.
     * @returns {Promise<Array>}
     */
    async searchSpotify(query, typeHint = 'track,artist,album') { // 👈 Acepta typeHint con valor por defecto
        try {
            // Pasamos el typeHint directamente al servicio de Spotify
            const result = await this.spotifyApiService.search(query, typeHint);
            return result;
        } catch (error) {
            console.error('Error in searchSpotify:', error);
            return [];
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
            return result || []; // Asegurarse de que sea un array
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
            console.log('SearchService searchIgdb result:', JSON.stringify(result, null, 2));
            const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
            if (debug) {
                const titles = Array.isArray(result) ? result.slice(0, 5).map(r => r.title) : [];
                console.log(`searchIgdb("${query}") -> ${Array.isArray(result) ? result.length : 0} items (sample: ${titles.join(', ')})`);
            }
            return result || []; // Asegurarse de que sea un array
        } catch (error) {
            console.error('Error in searchIgdb:', error);
            return [];
        }
    }

    /**
     * Busca videojuegos en RAWG.
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async searchRawg(query) {
        try {
            const result = await this.rawgApiService.search(query);
            const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
            if (debug) {
                const titles = Array.isArray(result) ? result.slice(0, 5).map(r => r.title) : [];
                console.log(`searchRawg("${query}") -> ${Array.isArray(result) ? result.length : 0} items (sample: ${titles.join(', ')})`);
            }
            return result || []; // Asegurarse de que sea un array
        } catch (error) {
            console.error('Error in searchRawg:', error);
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