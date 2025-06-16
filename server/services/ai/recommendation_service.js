// services/recommendation_service.js
const SearchService = require('./../search_service');
const GeminiAiService = require('./gemini_ai_service');

class RecommendationService {
  constructor() {
    this.searchService = new SearchService();
    this.geminiAiService = new GeminiAiService();
  }

  // Helper function to map item data to the desired schem
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
        mappedItem.coverUrl = itemData.imageLinks?.thumbnail || null;
        mappedItem.releaseDate = itemData.publishedDate;
        mappedItem.externalId = itemData.id;
        mappedItem.avgRating = itemData.averageRating;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      case 'videogame':
        mappedItem.title = itemData.name;
        mappedItem.description = itemData.summary;
        mappedItem.coverUrl = itemData.cover_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${itemData.cover_id}.jpg` : null;
        mappedItem.releaseDate = itemData.first_release_date ? new Date(itemData.first_release_date * 1000).toISOString().split('T')[0] : null;
        mappedItem.externalId = itemData.id ? String(itemData.id) : null;
        mappedItem.avgRating = itemData.aggregated_rating || null;
        mappedItem.externalUrl = itemData.external_url || null;
        break;

      default:
        console.warn(`Tipo de ítem desconocido para mapeo: ${itemType}`);
        break;
    }

    Object.keys(mappedItem).forEach(key => mappedItem[key] === undefined && delete mappedItem[key]);

    return mappedItem;
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

      const recommendedQueries = await this.geminiAiService.generateRecommendations('peliculas', itemName, itemContext);
      console.log('Gemini LLM recommended queries for movies:', recommendedQueries);

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
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendMovies service using Gemini LLM:', error);
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

        const recommendedQueries = await this.geminiAiService.generateRecommendations('canciones', itemName, itemContext);
        console.log('Gemini LLM recommended queries for songs:', recommendedQueries);

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
            if (allRecommendedItems.length >= 10) break;
        }
        return allRecommendedItems;
    } catch (error) {
        console.error('Error in recommendSongs service using Gemini LLM:', error);
        return [];
    }
  }

  async recommendTvShows(itemName) {
    try {
      // *** CAMBIO AQUÍ: Usar searchTmdb para TV Shows ***
      const initialSearchResult = await this.searchService.searchTmdb(itemName);
      const baseTvShow = initialSearchResult.tvshows[0];

      let itemContext = '';
      if (baseTvShow) {
        if (baseTvShow.genres && baseTvShow.genres.length > 0) {
          itemContext = `del género ${baseTvShow.genres[0].name || baseTvShow.genres[0]}`;
        }
      }

      const recommendedQueries = await this.geminiAiService.generateRecommendations('series de televisión', itemName, itemContext);
      console.log('Gemini LLM recommended queries for TV Shows:', recommendedQueries);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // *** CAMBIO AQUÍ: Mapear promesas para llamar a searchTmdb para cada query ***
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
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendTvShows service using Gemini LLM:', error);
      return [];
    }
  }

  async recommendBooks(itemName) {
    try {
      // *** CAMBIO AQUÍ: Usar searchGoogleBooks para Books ***
      const baseBook = (await this.searchService.searchGoogleBooks(itemName))[0];

      let itemContext = '';
      if (baseBook) {
        if (baseBook.authors && baseBook.authors.length > 0) {
          itemContext = `del autor ${baseBook.authors[0]}`;
        }
      }

      const recommendedQueries = await this.geminiAiService.generateRecommendations('libros', itemName, itemContext);
      console.log('Gemini LLM recommended queries for Books:', recommendedQueries);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // *** CAMBIO AQUÍ: Mapear promesas para llamar a searchGoogleBooks para cada query ***
      const searchPromises = recommendedQueries.map(query => this.searchService.searchGoogleBooks(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.length > 0) { // GoogleBooks devuelve array directo
          const book = result.value[0];
          if (book.id && !addedExternalIds.has(`book-${book.id}`)) {
            const mappedBook = this._mapToItemSchema(book, 'book', 'GoogleBooks');
            allRecommendedItems.push(mappedBook);
            addedExternalIds.add(`book-${book.id}`);
          }
        }
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendBooks service using Gemini LLM:', error);
      return [];
    }
  }

  async recommendVideogames(itemName) {
    try {
      // *** CAMBIO AQUÍ: Usar searchIgdb para Videogames ***
      const baseVideogame = (await this.searchService.searchIgdb(itemName))[0];

      let itemContext = '';
      if (baseVideogame) {
        if (baseVideogame.genres && baseVideogame.genres.length > 0) {
          itemContext = `del género ${baseVideogame.genres[0].name || baseVideogame.genres[0]}`;
        }
      }

      const recommendedQueries = await this.geminiAiService.generateRecommendations('videojuegos', itemName, itemContext);
      console.log('Gemini LLM recommended queries for Videogames:', recommendedQueries);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // *** CAMBIO AQUÍ: Mapear promesas para llamar a searchIgdb para cada query ***
      const searchPromises = recommendedQueries.map(query => this.searchService.searchIgdb(query));
      const searchResults = await Promise.allSettled(searchPromises);

      for (const result of searchResults) {
        if (result.status === 'fulfilled' && result.value.length > 0) { // IGDB devuelve array directo
          const videogame = result.value[0];
          if (videogame.id && !addedExternalIds.has(`videogame-${videogame.id}`)) {
            const mappedVideogame = this._mapToItemSchema(videogame, 'videogame', 'IGDB');
            allRecommendedItems.push(mappedVideogame);
            addedExternalIds.add(`videogame-${videogame.id}`);
          }
        }
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendVideogames service using Gemini LLM:', error);
      return [];
    }
  }

  async recommendArtists(itemName) {
    try {
      // *** CAMBIO AQUÍ: Usar searchSpotify para Artists ***
      const initialSearchResult = await this.searchService.searchSpotify(itemName);
      const baseArtist = initialSearchResult.artists[0];

      let itemContext = '';
      if (baseArtist && baseArtist.genres && baseArtist.genres.length > 0) {
        itemContext = `del género ${baseArtist.genres[0]}`; // Spotify genres son strings directos
      }

      const recommendedQueries = await this.geminiAiService.generateRecommendations('artistas', itemName, itemContext);
      console.log('Gemini LLM recommended queries for Artists:', recommendedQueries);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // *** CAMBIO AQUÍ: Mapear promesas para llamar a searchSpotify para cada query ***
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
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendArtists service using Gemini LLM:', error);
      return [];
    }
  }

  async recommendAlbums(itemName) {
    try {
      // *** CAMBIO AQUÍ: Usar searchSpotify para Albums ***
      const initialSearchResult = await this.searchService.searchSpotify(itemName);
      const baseAlbum = initialSearchResult.albums[0];

      let itemContext = '';
      if (baseAlbum && baseAlbum.artist_name) {
        itemContext = `del artista ${baseAlbum.artist_name}`;
      } else if (baseAlbum && baseAlbum.artists && baseAlbum.artists.length > 0) {
          itemContext = `del artista ${baseAlbum.artists[0].name}`;
      }

      const recommendedQueries = await this.geminiAiService.generateRecommendations('álbumes', itemName, itemContext);
      console.log('Gemini LLM recommended queries for Albums:', recommendedQueries);

      const allRecommendedItems = [];
      const addedExternalIds = new Set();

      // *** CAMBIO AQUÍ: Mapear promesas para llamar a searchSpotify para cada query ***
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
        if (allRecommendedItems.length >= 10) break;
      }
      return allRecommendedItems;
    } catch (error) {
      console.error('Error in recommendAlbums service using Gemini LLM:', error);
      return [];
    }
  }
}

module.exports = RecommendationService;