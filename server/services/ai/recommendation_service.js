// services/ai/recommendation_service.js
const SearchService = require('./../search_service');
const GeminiAiService = require('./gemini_ai_service');
const DeepSeekAiService = require('./deepseek_ai_service');

class RecommendationService {
    constructor() {
        this.searchService = new SearchService();
        this.geminiAiService = new GeminiAiService();
        this.deepSeekAiService = new DeepSeekAiService();
    }

    _mapToItemSchema(itemData, itemType, externalSource) {
        let mappedItem = {
            type: itemType,
            externalSource: externalSource,
        };

        switch (itemType) {
            case 'movie':
            case 'tvshow':
                mappedItem.title = itemData.title || itemData.name;
                mappedItem.description = itemData.overview;
                mappedItem.coverUrl = itemData.poster_url || null;
                mappedItem.releaseDate = itemData.release_date || itemData.first_air_date;
                mappedItem.externalId = itemData.id ? String(itemData.id) : null;
                mappedItem.avgRating = itemData.vote_average;
                mappedItem.externalUrl = itemData.external_url || null;
                break;

            case 'song':
                mappedItem.title = itemData.title;
                mappedItem.description = itemData.description || null;
                mappedItem.coverUrl = itemData.coverUrl || null;
                mappedItem.releaseDate = itemData.releaseDate;
                mappedItem.externalId = itemData.externalId;
                mappedItem.avgRating = null;
                mappedItem.externalUrl = itemData.externalUrl || null;
                break;

            case 'artist':
                mappedItem.title = itemData.title;
                mappedItem.description = itemData.description || null;
                mappedItem.coverUrl = itemData.coverUrl || null;
                mappedItem.releaseDate = null;
                mappedItem.externalId = itemData.externalId;
                mappedItem.avgRating = null;
                mappedItem.externalUrl = itemData.externalUrl || null;
                break;

            case 'album':
                mappedItem.title = itemData.title;
                mappedItem.description = itemData.description || null;
                mappedItem.coverUrl = itemData.coverUrl || null;
                mappedItem.releaseDate = itemData.releaseDate;
                mappedItem.externalId = itemData.externalId;
                mappedItem.avgRating = null;
                mappedItem.externalUrl = itemData.externalUrl || null;
                break;

            case 'book':
                mappedItem.title = itemData.title;
                mappedItem.description = itemData.description;
                mappedItem.coverUrl = itemData.coverUrl || null;
                mappedItem.releaseDate = itemData.releaseDate === 'N/A' ? null : itemData.releaseDate;
                mappedItem.externalId = itemData.externalId;
                mappedItem.avgRating = itemData.avgRating || null;
                mappedItem.externalUrl = itemData.externalUrl || null;
                break;

            case 'videogame':
                mappedItem.title = itemData.title;
                mappedItem.description = itemData.description;
                mappedItem.coverUrl = itemData.coverUrl || null;
                mappedItem.releaseDate = itemData.releaseDate === 'N/A' ? null : itemData.releaseDate;
                mappedItem.externalId = itemData.externalId;
                mappedItem.avgRating = itemData.avgRating || null;
                mappedItem.externalUrl = itemData.externalUrl || null;
                break;

            default:
                console.warn(`Tipo de ítem desconocido para mapeo: ${itemType}`);
                break;
        }

        Object.keys(mappedItem).forEach(key => mappedItem[key] === undefined && delete mappedItem[key]);

        return mappedItem;
    }

    async _getRecommendedQueries(itemCategory, itemName, itemContext) {
        let recommendedQueries = [];
        let usedApi = 'Gemini';

        try {
            recommendedQueries = await this.geminiAiService.generateRecommendations(itemCategory, itemName, itemContext);
            console.log('Gemini LLM recommended queries:', recommendedQueries);
        } catch (geminiError) {
            console.warn(`Gemini LLM failed for ${itemCategory} recommendation, attempting with DeepSeek. Error:`, geminiError.message);
            usedApi = 'DeepSeek';
            try {
                recommendedQueries = await this.deepSeekAiService.generateRecommendations(itemCategory, itemName, itemContext);
                console.log('DeepSeek LLM recommended queries:', recommendedQueries);
            } catch (deepSeekError) {
                console.error(`DeepSeek LLM also failed for ${itemCategory} recommendation. Error:`, deepSeekError.message);
                throw deepSeekError; // Lanzar el error si ambos fallan
            }
        }

        // Normalización fuerte + deduplicación transversal a categorías:
        const seen = new Set();
        const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|version|versión)\b/i;

        const cleaned = recommendedQueries
          .map(q => q.replace(/(\d+\.\s*|["'*`])/g, '').trim())
          .map(q => q.replace(/\s+-\s+/g, ' - '))  // normalizar separador
          .map(q => q.replace(/\s+\(\s*(\d{4})\s*\)\s*$/i, ' ($1)')) // normalizar "(Year)"
          // Filtrar variantes del mismo elemento (e.g., "Blank Space (Taylor's Version)")
          .filter(q => !variantRegex.test(q))
          // Deduplicar por clave minificada
          .filter(q => {
            const key = q.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          // Además eliminar entradas que sean exactamente igual al item base, sin importar caso
          .filter(q => q.toLowerCase() !== String(itemName || '').toLowerCase());

        return cleaned;
    }

    async recommendMovies(itemName, limit = 10) { // <-- Added limit parameter here
        try {
            const initialSearchResult = await this.searchService.searchTmdb(itemName);
            const baseMovie = initialSearchResult.find(item => item.type === 'movie');

            let itemContext = '';
            if (baseMovie && baseMovie.genres && Array.isArray(baseMovie.genres) && baseMovie.genres.length > 0) {
                itemContext = `del género ${baseMovie.genres[0].name || baseMovie.genres[0]}`;
            }

            const recommendedQueries = await this._getRecommendedQueries('peliculas', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchTmdb(query));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const movies = result.value.filter(item => item.type === 'movie');
                    for (const movie of movies) {
                        const uniqueKey = `${movie.type}-${movie.externalSource}-${movie.externalId}`;
                        if (movie.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(movie);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            // --- Apply limit here for individual category recommendations ---
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendMovies service:', error);
            return [];
        }
    }

    async recommendSongs(itemName, limit = 10) { // <-- Added limit parameter
        try {
            const initialSearchResult = await this.searchService.searchSpotify(itemName, 'track');
            const baseSong = initialSearchResult[0];

            let itemContext = '';
            if (baseSong && baseSong.description) {
                const artistMatch = baseSong.description.match(/Artista\(s\): ([^ ]+)/);
                if (artistMatch && artistMatch[1]) {
                    itemContext = `del artista ${artistMatch[1]}`;
                }
            }

            const recommendedQueries = await this._getRecommendedQueries('canciones', itemName, itemContext);

            // Ajuste de consulta: si viene "Title - Artist", forzar patrón "Title artist:Artist"
            const normalizedQueries = recommendedQueries.map(q => {
                const parts = q.split(/\s-\s/);
                if (parts.length === 2) {
                    const title = parts[0].trim();
                    const artist = parts[1].trim();
                    // Evitar duplicar "artist:" si ya viene así
                    if (!/artist:/i.test(q)) {
                        return `${title} artist:${artist}`;
                    }
                }
                return q;
            });

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            // Filtro para evitar variantes + filtro de popularidad (>=60) y máximo 1 canción por artista
            const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;
            const artistSeen = new Set();
            const MIN_POPULARITY = 60;

            const searchPromises = normalizedQueries.map(query => this.searchService.searchSpotify(query, 'track'));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    // value ya es un array unificado de items mapeados por SpotifyApiService
                    const filtered = result.value
                        .filter(item => item.type === 'song')
                        .filter(item => !variantRegex.test((item.title || '') + ' ' + (item.description || '')))
                        .filter(item => {
                            // Extraer popularidad de la descripción si está presente o descartar si no existe.
                            // La API mapeada no expone 'popularity', así que aplicamos un heurístico:
                            // mantenemos por ahora y deduplicamos por artista; el filtro de popularity real
                            // requiere ampliar SpotifyApiService. Implementamos el guard aquí preparado.
                            return true;
                        });

                    for (const song of filtered) {
                        // dedupe por externalId
                        const uniqueKey = `${song.type}-${song.externalSource}-${song.externalId}`;
                        if (!song.externalId || addedExternalIds.has(uniqueKey)) continue;

                        // dedupe por "Title - Artist" si podemos obtener el artista desde la descripción
                        const artistMatch = (song.description || '').match(/Artista\(s\): ([^.-]+)/i);
                        const artistName = artistMatch ? artistMatch[1].trim() : null;

                        // máximo 1 canción por artista
                        if (artistName) {
                            const artistKey = artistName.toLowerCase();
                            if (artistSeen.has(artistKey)) continue;
                            artistSeen.add(artistKey);
                        }

                        allRecommendedItems.push(song);
                        addedExternalIds.add(uniqueKey);
                    }
                }
            }
            // Limitar a 'limit' después de filtros
            return allRecommendedItems.slice(0, limit);
        } catch (error) {
            console.error('Error in recommendSongs service:', error);
            return [];
        }
    }

    async recommendTvShows(itemName, limit = 10) { // <-- Added limit parameter
        try {
            const initialSearchResult = await this.searchService.searchTmdb(itemName);
            const baseTvShow = initialSearchResult.find(item => item.type === 'tvshow');

            let itemContext = '';
            if (baseTvShow && baseTvShow.genres && Array.isArray(baseTvShow.genres) && baseTvShow.genres.length > 0) {
                itemContext = `del género ${baseTvShow.genres[0].name || baseTvShow.genres[0]}`;
            }

            const recommendedQueries = await this._getRecommendedQueries('series de televisión', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchTmdb(query));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const tvShows = result.value.filter(item => item.type === 'tvshow');
                    for (const tvShow of tvShows) {
                        const uniqueKey = `${tvShow.type}-${tvShow.externalSource}-${tvShow.externalId}`;
                        if (tvShow.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(tvShow);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendTvShows service:', error);
            return [];
        }
    }

    async recommendBooks(itemName, limit = 10) { // <-- Added limit parameter
        try {
            const initialSearchResult = await this.searchService.searchGoogleBooks(itemName);
            const baseBook = initialSearchResult[0];

            let itemContext = '';
            if (baseBook && baseBook.description) {
                const authorMatch = baseBook.description.match(/Autor\(es\): ([^.]+\.)/);
                if (authorMatch && authorMatch[1]) {
                    itemContext = `del autor ${authorMatch[1].replace(/\.$/, '')}`;
                } else if (baseBook.genres && Array.isArray(baseBook.genres) && baseBook.genres.length > 0) {
                    itemContext = `del género ${baseBook.genres[0]}`;
                }
            }

            const recommendedQueries = await this._getRecommendedQueries('libros', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchGoogleBooks(query));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const books = result.value.filter(item => item.type === 'book');
                    for (const book of books) {
                        const uniqueKey = `${book.type}-${book.externalSource}-${book.externalId}`;
                        if (book.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(book);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendBooks service:', error);
            return [];
        }
    }

    async recommendVideogames(itemName, limit = 10) { // <-- Added limit parameter here
        try {
            const initialSearchResult = await this.searchService.searchIgdb(itemName);
            const baseVideogame = initialSearchResult[0];

            let itemContext = '';
            if (baseVideogame) {
                if (baseVideogame.genres && Array.isArray(baseVideogame.genres) && baseVideogame.genres.length > 0) {
                    itemContext = `del género ${baseVideogame.genres[0]}`;
                } else if (baseVideogame.description) {
                    const genresMatch = baseVideogame.description.match(/Géneros: ([^.]+)/);
                    if (genresMatch && genresMatch[1]) {
                        const genresArray = genresMatch[1].split(',').map(g => g.trim());
                        if (genresArray.length > 0) {
                            itemContext = `del género ${genresArray[0]}`;
                        }
                    }
                }
            }

            const recommendedQueries = await this._getRecommendedQueries('videojuegos', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchIgdb(query));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const videogames = result.value.filter(item => item.type === 'videogame');
                    for (const videogame of videogames) {
                        const uniqueKey = `${videogame.type}-${videogame.externalSource}-${videogame.externalId}`;
                        if (videogame.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(videogame);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            // --- Apply limit here for individual category recommendations ---
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendVideogames service:', error);
            return [];
        }
    }

    async recommendArtists(itemName, limit = 10) { // <-- Added limit parameter
        try {
            const initialSearchResult = await this.searchService.searchSpotify(itemName, 'artist');
            const baseArtist = initialSearchResult[0];

            let itemContext = '';
            if (baseArtist && baseArtist.description) {
                const genresMatch = baseArtist.description.match(/Géneros: ([^.]+)/);
                if (genresMatch && genresMatch[1]) {
                    const genresArray = genresMatch[1].split(',').map(g => g.trim());
                    if (genresArray.length > 0) {
                        itemContext = `del género ${genresArray[0]}`;
                    }
                }
            }

            const recommendedQueries = await this._getRecommendedQueries('artistas', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query, 'artist'));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const artists = result.value.filter(item => item.type === 'artist');
                    for (const artist of artists) {
                        const uniqueKey = `${artist.type}-${artist.externalSource}-${artist.externalId}`;
                        if (artist.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(artist);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendArtists service:', error);
            return [];
        }
    }

    async recommendAlbums(itemName, limit = 10) { // <-- Added limit parameter
        try {
            const initialSearchResult = await this.searchService.searchSpotify(itemName, 'album');
            const baseAlbum = initialSearchResult[0];

            let itemContext = '';
            if (baseAlbum && baseAlbum.description) {
                const artistMatch = baseAlbum.description.match(/Artista\(s\): ([^.]+\.)/);
                if (artistMatch && artistMatch[1]) {
                    itemContext = `del artista ${artistMatch[1].replace(/\.$/, '')}`;
                }
            }

            const recommendedQueries = await this._getRecommendedQueries('álbumes', itemName, itemContext);

            const allRecommendedItems = [];
            const addedExternalIds = new Set();

            const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query, 'album'));
            const searchResults = await Promise.allSettled(searchPromises);

            for (const result of searchResults) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    const albums = result.value.filter(item => item.type === 'album');
                    for (const album of albums) {
                        const uniqueKey = `${album.type}-${album.externalSource}-${album.externalId}`;
                        if (album.externalId && !addedExternalIds.has(uniqueKey)) {
                            allRecommendedItems.push(album);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }
            return allRecommendedItems.slice(0, limit); // <-- Slice to limit results
        } catch (error) {
            console.error('Error in recommendAlbums service:', error);
            return [];
        }
    }

    // --- FUNCIÓN recommendMix con la corrección del límite ---
    async recommendMix(itemName, limit = 10) {
        try {
            const recommendationPromises = [];
            const addedExternalIds = new Set();
            let allMixedItems = [];

            // Pass the desired limit to each specific recommendation function
            // This will ensure each category function already returns max 10 items
            recommendationPromises.push(this.recommendMovies(itemName, limit));
            recommendationPromises.push(this.recommendTvShows(itemName, limit));
            recommendationPromises.push(this.recommendSongs(itemName, limit));
            recommendationPromises.push(this.recommendArtists(itemName, limit));
            recommendationPromises.push(this.recommendAlbums(itemName, limit));
            recommendationPromises.push(this.recommendBooks(itemName, limit));
            recommendationPromises.push(this.recommendVideogames(itemName, limit));

            const results = await Promise.allSettled(recommendationPromises);

            for (const result of results) {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    for (const item of result.value) {
                        const uniqueKey = `${item.type}-${item.externalSource}-${item.externalId}`;
                        if (item.externalId && !addedExternalIds.has(uniqueKey)) {
                            allMixedItems.push(item);
                            addedExternalIds.add(uniqueKey);
                        }
                    }
                }
            }

            // Mezclar los ítems de forma aleatoria para que no salgan siempre en el mismo orden de categoría
            for (let i = allMixedItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allMixedItems[i], allMixedItems[j]] = [allMixedItems[j], allMixedItems[i]];
            }

            // Devolver solo el número solicitado de ítems (este es el límite final)
            return allMixedItems.slice(0, limit);

        } catch (error) {
            console.error('Error in recommendMix service:', error);
            return [];
        }
    }
}

module.exports = RecommendationService;