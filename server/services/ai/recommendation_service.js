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

      case 'song': // El nuevo tipo para canciones unificadas
        mappedItem.title = itemData.title;
        mappedItem.description = itemData.description || null;
        mappedItem.coverUrl = itemData.coverUrl || null; // Usar coverUrl del item unificado
        mappedItem.releaseDate = itemData.releaseDate; // Usar releaseDate del item unificado
        mappedItem.externalId = itemData.externalId; // Usar externalId del item unificado
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.externalUrl || null;
        break;

      case 'artist': // El nuevo tipo para artistas unificados
        mappedItem.title = itemData.title; // name ahora es title
        mappedItem.description = itemData.description || null;
        mappedItem.coverUrl = itemData.coverUrl || null; // image_url ahora es coverUrl
        mappedItem.releaseDate = null;
        mappedItem.externalId = itemData.externalId; // Usar externalId del item unificado
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.externalUrl || null;
        break;

      case 'album': // El nuevo tipo para álbumes unificados
        mappedItem.title = itemData.title; // name ahora es title
        mappedItem.description = itemData.description || null;
        mappedItem.coverUrl = itemData.coverUrl || null; // thumbnail_url ahora es coverUrl
        mappedItem.releaseDate = itemData.releaseDate; // Usar releaseDate del item unificado
        mappedItem.externalId = itemData.externalId; // Usar externalId del item unificado
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.externalUrl || null;
        break;

      case 'book':
        mappedItem.title = itemData.title;
        mappedItem.description = itemData.description;
        mappedItem.coverUrl = itemData.coverUrl || null; // thumbnail_url ahora es coverUrl
        mappedItem.releaseDate = itemData.releaseDate === 'N/A' ? null : itemData.releaseDate; // published_date ahora es releaseDate
        mappedItem.externalId = itemData.externalId; // Usar externalId del item unificado
        mappedItem.avgRating = itemData.avgRating || null; // avg_rating ahora es avgRating
        mappedItem.externalUrl = itemData.externalUrl || null;
        break;

      case 'videogame':
        mappedItem.title = itemData.title; // name ahora es title
        mappedItem.description = itemData.description; // summary ahora es description
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
    return recommendedQueries;
  }

  // RECUERDA: TMDB ahora debe devolver un array plano de ítems unificados.
  async recommendMovies(itemName) {
    try {
      // searchTmdb ahora devuelve un array plano. Necesitamos encontrar el primer elemento que sea una película.
      const initialSearchResult = await this.searchService.searchTmdb(itemName);
      const baseMovie = initialSearchResult.find(item => item.type === 'movie'); // Encuentra la primera película

      let itemContext = '';
      if (baseMovie) {
        // En un ítem unificado de película, los géneros deberían estar accesibles directamente
        // o ser parte de la descripción, no hay una propiedad 'genres' separada en el mapeo inicial.
        // Si TmdbApiService mapea los géneros, podrían estar en una propiedad custom como 'genresList'.
        // Aquí asumiré que si los tienes, están en baseMovie.genres (como array de strings o de objetos {id, name})
        if (baseMovie.genres && Array.isArray(baseMovie.genres) && baseMovie.genres.length > 0) {
          // Si genres es un array de objetos, toma el nombre. Si es array de strings, toma el string.
          itemContext = `del género ${baseMovie.genres[0].name || baseMovie.genres[0]}`;
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('peliculas', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // Las promesas de búsqueda ahora esperan un array plano
      const searchPromises = recommendedQueries.map(query => this.searchService.searchTmdb(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          // Filtrar solo las películas de los resultados
          const movies = result.value.filter(item => item.type === 'movie');
          for (const movie of movies) {
            // Un item unificado ya tiene externalId y externalSource definidos
            const uniqueKey = `${movie.type}-${movie.externalSource}-${movie.externalId}`;
            if (movie.externalId && !addedExternalIds.has(uniqueKey)) {
              // El item ya está en el formato ItemSchema, no necesita mapeo adicional si TmdbApiService lo hace bien.
              allRecommendedItems.push(movie);
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendMovies service:', error);
      return [];
    }
  }

  // RECUERDA: Spotify ahora debe devolver un array plano de ítems unificados.
  async recommendSongs(itemName) {
    try {
      // Buscar canciones específicamente con type 'track'
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'track');
      // initialSearchResult ya es un array de canciones unificadas, toma la primera.
      const baseSong = initialSearchResult[0]; // ¡CORREGIDO! initialSearchResult es el array

      let itemContext = '';
      if (baseSong && baseSong.description) { // La descripción de la canción unificada contiene el artista
        const artistMatch = baseSong.description.match(/Artista\(s\): ([^ ]+)/); // Ejemplo: "Artista(s): Artist Name"
        if (artistMatch && artistMatch[1]) {
          itemContext = `del artista ${artistMatch[1]}`;
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('canciones', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // Las promesas de búsqueda ahora esperan un array plano
      const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query, 'track')); // Buscar solo tracks
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          // Filtrar solo las canciones de los resultados (aunque ya pedimos 'track' directamente)
          const songs = result.value.filter(item => item.type === 'song');
          for (const song of songs) {
            const uniqueKey = `${song.type}-${song.externalSource}-${song.externalId}`;
            if (song.externalId && !addedExternalIds.has(uniqueKey)) {
              allRecommendedItems.push(song); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendSongs service:', error);
      return [];
    }
  }

  // RECUERDA: TMDB ahora debe devolver un array plano de ítems unificados.
  async recommendTvShows(itemName) {
    try {
      // searchTmdb ahora devuelve un array plano. Necesitamos encontrar el primer elemento que sea una serie.
      const initialSearchResult = await this.searchService.searchTmdb(itemName);
      const baseTvShow = initialSearchResult.find(item => item.type === 'tvshow'); // Encuentra la primera serie

      let itemContext = '';
      if (baseTvShow) {
        if (baseTvShow.genres && Array.isArray(baseTvShow.genres) && baseTvShow.genres.length > 0) {
          itemContext = `del género ${baseTvShow.genres[0].name || baseTvShow.genres[0]}`;
        }
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
              allRecommendedItems.push(tvShow); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendTvShows service:', error);
      return [];
    }
  }

  // RECUERDA: GoogleBooks ahora debe devolver un array plano de ítems unificados.
  async recommendBooks(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchGoogleBooks(itemName);
      // initialSearchResult ya es un array de libros unificados, toma el primero.
      const baseBook = initialSearchResult[0]; // ¡CORREGIDO! initialSearchResult es el array

      let itemContext = '';
      if (baseBook && baseBook.description) { // La descripción del libro unificada puede contener autores
          const authorMatch = baseBook.description.match(/Autor\(es\): ([^.]+\.)/); // Ejemplo: "Autor(es): Author Name."
          if (authorMatch && authorMatch[1]) {
              itemContext = `del autor ${authorMatch[1].replace(/\.$/, '')}`; // Eliminar punto final
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
              allRecommendedItems.push(book); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendBooks service:', error);
      return [];
    }
  }

  // RECUERDA: IGDB ahora debe devolver un array plano de ítems unificados.
  async recommendVideogames(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchIgdb(itemName);
      // initialSearchResult ya es un array de videojuegos unificados, toma el primero.
      const baseVideogame = initialSearchResult[0]; // ¡CORREGIDO! initialSearchResult es el array

      let itemContext = '';
      if (baseVideogame) {
          // Los géneros ya deberían estar en una propiedad `genres` en el item unificado, si tu IgdbApiService los mapea.
          // O podrían ser parte de la descripción.
          if (baseVideogame.genres && Array.isArray(baseVideogame.genres) && baseVideogame.genres.length > 0) {
              itemContext = `del género ${baseVideogame.genres[0]}`;
          } else if (baseVideogame.description) {
              // Si los géneros están en la descripción (ej. "Géneros: RPG, Acción"), puedes extraerlos
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
              allRecommendedItems.push(videogame); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendVideogames service:', error);
      return [];
    }
  }

  // RECUERDA: Spotify ahora debe devolver un array plano de ítems unificados.
  async recommendArtists(itemName) {
    try {
      // Buscar artistas específicamente con type 'artist'
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'artist');
      // initialSearchResult ya es un array de artistas unificados, toma el primero.
      const baseArtist = initialSearchResult[0]; // ¡CORREGIDO! initialSearchResult es el array

      let itemContext = '';
      if (baseArtist && baseArtist.description) { // La descripción del artista unificada contiene los géneros
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

      const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query, 'artist')); // Buscar solo artists
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          const artists = result.value.filter(item => item.type === 'artist');
          for (const artist of artists) {
            const uniqueKey = `${artist.type}-${artist.externalSource}-${artist.externalId}`;
            if (artist.externalId && !addedExternalIds.has(uniqueKey)) {
              allRecommendedItems.push(artist); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendArtists service:', error);
      return [];
    }
  }

  // RECUERDA: Spotify ahora debe devolver un array plano de ítems unificados.
  async recommendAlbums(itemName) {
    try {
      // Buscar álbumes específicamente con type 'album'
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'album');
      // initialSearchResult ya es un array de álbumes unificados, toma el primero.
      const baseAlbum = initialSearchResult[0]; // ¡CORREGIDO! initialSearchResult es el array

      let itemContext = '';
      if (baseAlbum && baseAlbum.description) { // La descripción del álbum unificada contiene el artista
        const artistMatch = baseAlbum.description.match(/Artista\(s\): ([^.]+\.)/);
        if (artistMatch && artistMatch[1]) {
            itemContext = `del artista ${artistMatch[1].replace(/\.$/, '')}`; // Eliminar punto final
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('álbumes', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query, 'album')); // Buscar solo albums
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          const albums = result.value.filter(item => item.type === 'album');
          for (const album of albums) {
            const uniqueKey = `${album.type}-${album.externalSource}-${album.externalId}`;
            if (album.externalId && !addedExternalIds.has(uniqueKey)) {
              allRecommendedItems.push(album); // El item ya está en formato ItemSchema
              addedExternalIds.add(uniqueKey);
            }
          }
        }
      }
      return allRecommendedItems;
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

      recommendationPromises.push(this.recommendMovies(itemName));
      recommendationPromises.push(this.recommendTvShows(itemName));
      recommendationPromises.push(this.recommendSongs(itemName));
      recommendationPromises.push(this.recommendArtists(itemName));
      recommendationPromises.push(this.recommendAlbums(itemName));
      recommendationPromises.push(this.recommendBooks(itemName));
      recommendationPromises.push(this.recommendVideogames(itemName));

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

      // Devolver solo el número solicitado de ítems
      return allMixedItems.slice(0, limit);

    } catch (error) {
      console.error('Error in recommendMix service:', error);
      return [];
    }
  }
}

module.exports = RecommendationService;