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
        // Strictly use Gemini as source of truth. Only fallback to DeepSeek if Gemini fails completely.
        let queries = [];
        try {
            queries = await this.geminiAiService.generateRecommendations(itemCategory, itemName, itemContext);
        } catch (geminiError) {
            console.warn(`Gemini LLM failed for ${itemCategory}. Falling back to DeepSeek.`, geminiError?.message || geminiError);
            try {
                queries = await this.deepSeekAiService.generateRecommendations(itemCategory, itemName, itemContext);
            } catch (deepSeekError) {
                console.error(`DeepSeek also failed for ${itemCategory}.`, deepSeekError?.message || deepSeekError);
                throw deepSeekError;
            }
        }

        // Normalize + dedupe while preserving Gemini intent as-is (no expansion here).
        const seen = new Set();
        const cleaned = (queries || [])
            .map(q => q.replace(/(\d+\.\s*|["'*`_])/g, '').trim())
            .map(q => q.replace(/\s+-\s+/g, ' - '))
            .filter(q => q.length > 0)
            .filter(q => {
                const key = q.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .filter(q => q.toLowerCase() !== String(itemName || '').toLowerCase());

        // Debug (gated)
        const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
        if (debug) console.log('[LLM] Final normalized Gemini queries:', cleaned);

        return cleaned;
    }

    async recommendMovies(itemName, limit = 10) {
        try {
            // Strict Gemini alignment for movies too
            const recommendedQueries = await this._getRecommendedQueries('peliculas', itemName, '');

            const finalItems = [];
            const usedFranchises = new Set();
            const usedCanonicalTitles = new Set();
            const droppedPattern = /\b(Season|Episode|Trailer|Featurette|Bundle|Collection|Pack)\b/i;
            const normalize = (s) => String(s || '').toLowerCase()
                .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[’‘`]/g, "'").replace(/&/g, 'and')
                .replace(/\s+/g, ' ').trim();

            const preferYear = (title) => {
                // prefer entries with year in the item data; handled via rating in absence
                return 0;
            };

            for (const q of recommendedQueries) {
                const results = await this.searchService.searchTmdb(q);
                const candidates = (results || [])
                    .filter(x => x.type === 'movie')
                    .filter(x => !droppedPattern.test(x.title || ''));

                const ranked = candidates
                    .map(x => {
                        const titleNorm = normalize(x.title);
                        const qNorm = normalize(q);
                        let sim = 0;
                        if (titleNorm === qNorm) sim += 3;
                        if (titleNorm.startsWith(qNorm)) sim += 2;
                        if (titleNorm.includes(qNorm)) sim += 1;
                        const rating = x.avgRating || 0;
                        return { x, score: sim * 10 + preferYear(x.title || '') + rating };
                    })
                    .sort((a, b) => b.score - a.score)
                    .map(r => r.x);

                let picked = null;
                for (const cand of ranked) {
                    const title = cand.title || '';
                    const canonicalKey = normalize(title).replace(/[:\-–—(].*$/, '').trim();
                    const franchiseKey = canonicalKey.split(' ').slice(0, 4).join(' ');
                    if (usedCanonicalTitles.has(canonicalKey)) continue;
                    if (usedFranchises.has(franchiseKey)) continue;
                    picked = cand;
                    usedCanonicalTitles.add(canonicalKey);
                    usedFranchises.add(franchiseKey);
                    break;
                }
                if (!picked && ranked.length > 0) {
                    for (const cand of ranked) {
                        const canonicalKey = normalize(cand.title).replace(/[:\-–—(].*$/, '').trim();
                        if (usedCanonicalTitles.has(canonicalKey)) continue;
                        picked = cand; break;
                    }
                }
                if (picked) {
                    finalItems.push(picked);
                } else {
                    finalItems.push({
                        type: 'movie',
                        title: q,
                        description: `No se encontró un mapeo canónico inequívoco para la consulta "${q}".`,
                        coverUrl: null,
                        releaseDate: null,
                        externalId: null,
                        externalSource: 'TMDB',
                        avgRating: null,
                        externalUrl: null,
                        _unmapped: true
                    });
                }
            }

            const mapped = finalItems.filter(i => !i._unmapped);
            const unmapped = finalItems.filter(i => i._unmapped);
            const sliced = mapped.slice(0, limit);
            const finalList = sliced.length < limit ? sliced.concat(unmapped.slice(0, limit - sliced.length)) : sliced;

            try {
                const titles = finalList.map(v => v.title);
                console.log('[recommendMovies] Curated final (Gemini-aligned):', titles);
            } catch {}

            return finalList;
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

    async recommendTvShows(itemName, limit = 10) {
        try {
            const recommendedQueries = await this._getRecommendedQueries('series de televisión', itemName, '');

            const finalItems = [];
            const usedFranchises = new Set();
            const usedCanonicalTitles = new Set();
            const droppedPattern = /\b(Season|Episode|Trailer|Featurette|Bundle|Collection|Pack)\b/i;
            const normalize = (s) => String(s || '').toLowerCase()
                .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[’‘`]/g, "'").replace(/&/g, 'and')
                .replace(/\s+/g, ' ').trim();

            for (const q of recommendedQueries) {
                const results = await this.searchService.searchTmdb(q);
                const candidates = (results || [])
                    .filter(x => x.type === 'tvshow')
                    .filter(x => !droppedPattern.test(x.title || ''));

                const ranked = candidates
                    .map(x => {
                        const titleNorm = normalize(x.title);
                        const qNorm = normalize(q);
                        let sim = 0;
                        if (titleNorm === qNorm) sim += 3;
                        if (titleNorm.startsWith(qNorm)) sim += 2;
                        if (titleNorm.includes(qNorm)) sim += 1;
                        const rating = x.avgRating || 0;
                        return { x, score: sim * 10 + rating };
                    })
                    .sort((a, b) => b.score - a.score)
                    .map(r => r.x);

                let picked = null;
                for (const cand of ranked) {
                    const title = cand.title || '';
                    const canonicalKey = normalize(title).replace(/[:\-–—(].*$/, '').trim();
                    const franchiseKey = canonicalKey.split(' ').slice(0, 4).join(' ');
                    if (usedCanonicalTitles.has(canonicalKey)) continue;
                    if (usedFranchises.has(franchiseKey)) continue;
                    picked = cand;
                    usedCanonicalTitles.add(canonicalKey);
                    usedFranchises.add(franchiseKey);
                    break;
                }
                if (!picked && ranked.length > 0) {
                    for (const cand of ranked) {
                        const canonicalKey = normalize(cand.title).replace(/[:\-–—(].*$/, '').trim();
                        if (usedCanonicalTitles.has(canonicalKey)) continue;
                        picked = cand; break;
                    }
                }
                if (picked) {
                    finalItems.push(picked);
                } else {
                    finalItems.push({
                        type: 'tvshow',
                        title: q,
                        description: `No se encontró un mapeo canónico inequívoco para la consulta "${q}".`,
                        coverUrl: null,
                        releaseDate: null,
                        externalId: null,
                        externalSource: 'TMDB',
                        avgRating: null,
                        externalUrl: null,
                        _unmapped: true
                    });
                }
            }

            const mapped = finalItems.filter(i => !i._unmapped);
            const unmapped = finalItems.filter(i => i._unmapped);
            const sliced = mapped.slice(0, limit);
            const finalList = sliced.length < limit ? sliced.concat(unmapped.slice(0, limit - sliced.length)) : sliced;

            try {
                const titles = finalList.map(v => v.title);
                console.log('[recommendTvShows] Curated final (Gemini-aligned):', titles);
            } catch {}

            return finalList;
        } catch (error) {
            console.error('Error in recommendTvShows service:', error);
            return [];
        }
    }

    async recommendBooks(itemName, limit = 10) {
        try {
            const recommendedQueries = await this._getRecommendedQueries('libros', itemName, '');

            const finalItems = [];
            const usedAuthors = new Set();
            const usedCanonicalTitles = new Set();
            const droppedPattern = /\b(Study Guide|Summary|Workbook|Collection|Bundle|Pack)\b/i;
            const normalize = (s) => String(s || '').toLowerCase()
                .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[’‘`]/g, "'").replace(/&/g, 'and')
                .replace(/\s+/g, ' ').trim();

            for (const q of recommendedQueries) {
                const results = await this.searchService.searchGoogleBooks(q);
                const candidates = (results || [])
                    .filter(x => x.type === 'book')
                    .filter(x => !droppedPattern.test(x.title || ''));

                const ranked = candidates
                    .map(x => {
                        const titleNorm = normalize(x.title);
                        const qNorm = normalize(q);
                        let sim = 0;
                        if (titleNorm === qNorm) sim += 3;
                        if (titleNorm.startsWith(qNorm)) sim += 2;
                        if (titleNorm.includes(qNorm)) sim += 1;
                        const rating = x.avgRating || 0;
                        return { x, score: sim * 10 + rating };
                    })
                    .sort((a, b) => b.score - a.score)
                    .map(r => r.x);

                let picked = null;
                for (const cand of ranked) {
                    const title = cand.title || '';
                    const canonicalKey = normalize(title).replace(/[:\-–—(].*$/, '').trim();
                    if (usedCanonicalTitles.has(canonicalKey)) continue;
                    picked = cand;
                    usedCanonicalTitles.add(canonicalKey);
                    break;
                }
                if (!picked && ranked.length > 0) {
                    for (const cand of ranked) {
                        const canonicalKey = normalize(cand.title).replace(/[:\-–—(].*$/, '').trim();
                        if (usedCanonicalTitles.has(canonicalKey)) continue;
                        picked = cand; break;
                    }
                }
                if (picked) {
                    finalItems.push(picked);
                } else {
                    finalItems.push({
                        type: 'book',
                        title: q,
                        description: `No se encontró un mapeo canónico inequívoco para la consulta "${q}".`,
                        coverUrl: null,
                        releaseDate: null,
                        externalId: null,
                        externalSource: 'GOOGLE_BOOKS',
                        avgRating: null,
                        externalUrl: null,
                        _unmapped: true
                    });
                }
            }

            const mapped = finalItems.filter(i => !i._unmapped);
            const unmapped = finalItems.filter(i => i._unmapped);
            const sliced = mapped.slice(0, limit);
            const finalList = sliced.length < limit ? sliced.concat(unmapped.slice(0, limit - sliced.length)) : sliced;

            try {
                const titles = finalList.map(v => v.title);
                console.log('[recommendBooks] Curated final (Gemini-aligned):', titles);
            } catch {}

            return finalList;
        } catch (error) {
            console.error('Error in recommendBooks service:', error);
            return [];
        }
    }

    async recommendVideogames(itemName, limit = 10) {
        try {
            // Strictly align to Gemini queries. One canonical pick per query. No fillers/duplicates.
            const recommendedQueries = await this._getRecommendedQueries('videojuegos', itemName, '');

            const finalItems = [];
            const usedCanonicalRoots = new Set();

            const normalize = (s) => String(s || '').toLowerCase()
                .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[’‘`]/g, "'")
                .replace(/&/g, 'and')
                .replace(/\s+/g, ' ')
                .trim();

            // Filter out irrelevant variants
            const dropVariant = (title) => /\b(DLC|Pack|Episode|Bundle|Season Pass|Character Pack|Pinball|Mobile|Royale)\b/i.test(title || '');

            // Edition preference score
            const editionScore = (title) => {
                const t = (title || '').toLowerCase();
                if (t.includes('legendary edition')) return 6;
                if (t.includes('definitive edition')) return 6;
                if (t.includes('remastered') || t.includes('remaster')) return 5;
                if (t.includes('game of the year') || t.includes('goty')) return 4;
                return 3; // base/unknown
            };

            for (const q of recommendedQueries) {
                const qNorm = normalize(q).replace(/\(\s*\d{4}\s*\)/g, '').trim();

                // Query IGDB with the Gemini query as-is
                const results = await this.searchService.searchIgdb(q);

                // Candidates: videogames only, drop obvious variants
                const candidates = (results || [])
                    .filter(x => x.type === 'videogame')
                    .filter(x => !dropVariant(x.title));

                // Rank by similarity + edition preference + rating/pop count (if present)
                const ranked = candidates
                    .map(x => {
                        const tNorm = normalize(x.title);
                        let sim = 0;
                        if (tNorm === qNorm) sim += 6;            // exact
                        if (tNorm.startsWith(qNorm)) sim += 3;    // prefix
                        if (tNorm.includes(qNorm)) sim += 2;      // substring
                        if (qNorm === 'knights of the old republic' && tNorm.includes('star wars')) sim += 2;

                        const ed = editionScore(x.title);
                        const rating = x.avgRating || 0;
                        const pop = (x.totalRatingCount || 0) * 0.01;

                        // canonical root before punctuation; used for dedupe/diversity
                        const root = tNorm.replace(/[:\-–—(].*$/, '').trim();

                        return { x, score: sim * 10 + ed * 2 + rating + pop, root };
                    })
                    .sort((a, b) => b.score - a.score);

                // Pick first not-yet-used canonical root
                let picked = null;
                for (const r of ranked) {
                    if (usedCanonicalRoots.has(r.root)) continue;
                    picked = r.x;
                    usedCanonicalRoots.add(r.root);
                    break;
                }

                if (picked) {
                    finalItems.push(picked);
                } else {
                    // If cannot map clearly, include placeholder entry to be surfaced to user with reason
                    finalItems.push({
                        type: 'videogame',
                        title: q,
                        description: `No se encontró un mapeo canónico inequívoco para la consulta "${q}".`,
                        coverUrl: null,
                        releaseDate: null,
                        externalId: null,
                        externalSource: 'IGDB',
                        avgRating: null,
                        externalUrl: null,
                        _unmapped: true
                    });
                }
            }

            // Prefer mapped items; cap to limit
            const mapped = finalItems.filter(i => !i._unmapped);
            const unmapped = finalItems.filter(i => i._unmapped);
            const curated = mapped.slice(0, limit);
            const finalList = curated.length < limit ? curated.concat(unmapped.slice(0, limit - curated.length)) : curated;

            const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
            if (debug) console.log('[recommendVideogames] Curated final (Gemini-aligned):', finalList.map(v => v.title));

            return finalList;
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