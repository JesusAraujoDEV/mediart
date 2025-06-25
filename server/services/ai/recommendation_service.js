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
        mappedItem.coverUrl = itemData.thumbnail_url || null;
        mappedItem.releaseDate = itemData.release_date;
        mappedItem.externalId = itemData.id;
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      case 'artist':
        mappedItem.title = itemData.name;
        mappedItem.description = null;
        mappedItem.coverUrl = itemData.image_url || null;
        mappedItem.releaseDate = null;
        mappedItem.externalId = itemData.id;
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      case 'album':
        mappedItem.title = itemData.name;
        mappedItem.description = null;
        mappedItem.coverUrl = itemData.thumbnail_url || null;
        mappedItem.releaseDate = itemData.release_date;
        mappedItem.externalId = itemData.id;
        mappedItem.avgRating = null;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      case 'book':
        mappedItem.title = itemData.title;
        mappedItem.description = itemData.description;
        mappedItem.coverUrl = itemData.thumbnail_url || null;
        mappedItem.releaseDate = itemData.published_date === 'N/A' ? null : itemData.published_date;
        mappedItem.externalId = itemData.id;
        mappedItem.avgRating = itemData.avg_rating || null;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      case 'videogame':
        mappedItem.title = itemData.name;
        mappedItem.description = itemData.summary;
        mappedItem.coverUrl = itemData.cover_url || null;
        mappedItem.releaseDate = itemData.release_date === 'N/A' ? null : itemData.release_date;
        mappedItem.externalId = itemData.id ? String(itemData.id) : null;
        mappedItem.avgRating = itemData.avg_rating || null;
        mappedItem.externalUrl = itemData.external_url || null;
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


  async recommendMovies(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchTmdb(itemName);
      const baseMovie = initialSearchResult.movies[0];

      let itemContext = '';
      if (baseMovie) {
        if (baseMovie.genres && baseMovie.genres.length > 0) {
            itemContext = `del género ${baseMovie.genres[0].name || baseMovie.genres[0]}`;
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('peliculas', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchTmdb(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.movies.length > 0) {
          const movie = result.value.movies[0];
          if (movie.id && !addedExternalIds.has(`movie-${movie.id}`)) {
            const mappedMovie = this._mapToItemSchema(movie, 'movie', 'TMDB');
            allRecommendedItems.push(mappedMovie);
            addedExternalIds.add(`movie-${movie.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendMovies service:', error);
      return [];
    }
  }

  async recommendSongs(itemName) {
    try {
        const initialSearchResult = await this.searchService.searchSpotify(itemName);
        const baseSong = initialSearchResult.songs[0];

        let itemContext = '';
        if (baseSong) {
            if (baseSong.artist_name) {
                itemContext = `del artista ${baseSong.artist_name}`;
            } else if (baseSong.artists && baseSong.artists.length > 0) {
                itemContext = `del artista ${baseSong.artists[0].name}`;
            }
        }

        const recommendedQueries = await this._getRecommendedQueries('canciones', itemName, itemContext);

        const allRecommendedItems = [];
        const addedExternalIds = new Set();

        const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query));
        const searchResults = await Promise.allSettled(searchPromises);

        for (const result of searchResults) {
            if (result.status === 'fulfilled' && result.value.songs.length > 0) {
                const song = result.value.songs[0];
                if (song.id && !addedExternalIds.has(`song-${song.id}`)) {
                    const mappedSong = this._mapToItemSchema(song, 'song', 'Spotify');
                    allRecommendedItems.push(mappedSong);
                    addedExternalIds.add(`song-${song.id}`);
                }
            }
            // ELIMINADO: if (allRecommendedItems.length >= 10) break;
        }
        return allRecommendedItems;
    } catch (error) {
        console.error('Error in recommendSongs service:', error);
        return [];
    }
  }

  async recommendTvShows(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchTmdb(itemName);
      const baseTvShow = initialSearchResult.tvshows[0];

      let itemContext = '';
      if (baseTvShow) {
        if (baseTvShow.genres && baseTvShow.genres.length > 0) {
          itemContext = `del género ${baseTvShow.genres[0].name || baseTvShow.genres[0]}`;
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('series de televisión', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchTmdb(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.tvshows.length > 0) {
          const tvShow = result.value.tvshows[0];
          if (tvShow.id && !addedExternalIds.has(`tvshow-${tvShow.id}`)) {
            const mappedTvShow = this._mapToItemSchema(tvShow, 'tvshow', 'TMDB');
            allRecommendedItems.push(mappedTvShow);
            addedExternalIds.add(`tvshow-${tvShow.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendTvShows service:', error);
      return [];
    }
  }

  async recommendBooks(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchGoogleBooks(itemName);
      const baseBook = initialSearchResult[0];

      let itemContext = '';
      if (baseBook && baseBook.authors) {
          itemContext = `del autor ${baseBook.authors}`;
      } else if (baseBook && baseBook.genres && Array.isArray(baseBook.genres) && baseBook.genres.length > 0) {
        itemContext = `del género ${baseBook.genres[0]}`;
      }

      const recommendedQueries = await this._getRecommendedQueries('libros', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchGoogleBooks(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          const book = result.value[0];
          if (book.id && !addedExternalIds.has(`book-${book.id}`)) {
            const mappedBook = this._mapToItemSchema(book, 'book', 'Google Books');
            allRecommendedItems.push(mappedBook);
            addedExternalIds.add(`book-${book.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendBooks service:', error);
      return [];
    }
  }

  async recommendVideogames(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchIgdb(itemName);
      const baseVideogame = initialSearchResult[0];

      let itemContext = '';
      if (baseVideogame) {
        if (baseVideogame.genres && Array.isArray(baseVideogame.genres) && baseVideogame.genres.length > 0) {
            const genresArray = typeof baseVideogame.genres === 'string' ? baseVideogame.genres.split(',').map(g => g.trim()) : baseVideogame.genres;
            itemContext = `del género ${genresArray[0]}`;
        } else if (baseVideogame.genres && typeof baseVideogame.genres === 'string') {
            const genresArray = baseVideogame.genres.split(',').map(g => g.trim());
            if (genresArray.length > 0) {
                itemContext = `del género ${genresArray[0]}`;
            }
        }
      }

      const recommendedQueries = await this._getRecommendedQueries('videojuegos', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchIgdb(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          const videogame = result.value[0];
          if (videogame.id && !addedExternalIds.has(`videogame-${videogame.id}`)) {
            const mappedVideogame = this._mapToItemSchema(videogame, 'videogame', 'IGDB');
            allRecommendedItems.push(mappedVideogame);
            addedExternalIds.add(`videogame-${videogame.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendVideogames service:', error);
      return [];
    }
  }

  async recommendArtists(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchSpotify(itemName);
      const baseArtist = initialSearchResult.artists[0];

      let itemContext = '';
      if (baseArtist && baseArtist.genres && baseArtist.genres.length > 0) {
        itemContext = `del género ${baseArtist.genres[0]}`;
      }

      const recommendedQueries = await this._getRecommendedQueries('artistas', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.artists.length > 0) {
          const artist = result.value.artists[0];
          if (artist.id && !addedExternalIds.has(`artist-${artist.id}`)) {
            const mappedArtist = this._mapToItemSchema(artist, 'artist', 'Spotify');
            allRecommendedItems.push(mappedArtist);
            addedExternalIds.add(`artist-${artist.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendArtists service:', error);
      return [];
    }
  }

  async recommendAlbums(itemName) {
    try {
      const initialSearchResult = await this.searchService.searchSpotify(itemName);
      const baseAlbum = initialSearchResult.albums[0];

      let itemContext = '';
      if (baseAlbum && baseAlbum.artist_name) {
        itemContext = `del artista ${baseAlbum.artist_name}`;
      } else if (baseAlbum && baseAlbum.artists && baseAlbum.artists.length > 0) {
          itemContext = `del artista ${baseAlbum.artists[0].name}`;
      }

      const recommendedQueries = await this._getRecommendedQueries('álbumes', itemName, itemContext);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      const searchPromises = recommendedQueries.map(query => this.searchService.searchSpotify(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.albums.length > 0) {
          const album = result.value.albums[0];
          if (album.id && !addedExternalIds.has(`album-${album.id}`)) {
            const mappedAlbum = this._mapToItemSchema(album, 'album', 'Spotify');
            allRecommendedItems.push(mappedAlbum);
            addedExternalIds.add(`album-${album.id}`);
          }
        }
        // ELIMINADO: if (allRecommendedItems.length >= 10) break;
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
      let allMixedItems = []; // Cambiado a let para permitir reasignación si se desea, aunque push es suficiente

      // Al no tener los 'break' internos en las funciones recommendX,
      // estas devolverán más ítems, lo que aumenta la probabilidad de variedad.
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
              // NOTA: No hacemos break aquí para que todas las categorías contribuyan,
              // el límite final se aplica después del shuffle.
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