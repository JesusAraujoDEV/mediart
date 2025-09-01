 // services/ai/recommendation_service.js
const SearchService = require('./../search_service');
const GeminiAiService = require('./gemini_ai_service');
const DeepSeekAiService = require('./deepseek_ai_service');

// Strategies
const MovieRecommendation = require('./recommendations/movie_recommendation');
const TvRecommendation = require('./recommendations/tv_recommendation');
const BookRecommendation = require('./recommendations/book_recommendation');
const SongRecommendation = require('./recommendations/song_recommendation');
const ArtistRecommendation = require('./recommendations/artist_recommendation');
const AlbumRecommendation = require('./recommendations/album_recommendation');
const VideogameRecommendation = require('./recommendations/videogame_recommendation');

const { cleanAndDedupeQueries } = require('./recommendations/utils/text');

class RecommendationService {
  constructor() {
    this.searchService = new SearchService();
    this.geminiAiService = new GeminiAiService();
    this.deepSeekAiService = new DeepSeekAiService();

    // instantiate strategies
    this.movieStrategy = new MovieRecommendation(this.searchService);
    this.tvStrategy = new TvRecommendation(this.searchService);
    this.bookStrategy = new BookRecommendation(this.searchService);
    this.songStrategy = new SongRecommendation(this.searchService);
    this.artistStrategy = new ArtistRecommendation(this.searchService);
    this.albumStrategy = new AlbumRecommendation(this.searchService);
    this.videogameStrategy = new VideogameRecommendation(this.searchService);
  }

  async _getRecommendedQueries(itemCategory, itemName, itemContext) {
    let queries = [];
    try {
      queries = await this.geminiAiService.generateRecommendations(itemCategory, itemName, itemContext);
      console.log(`[Gemini] Raw recommendations for ${itemCategory} ("${itemName}") ctx="${itemContext || ''}":`, queries);
    } catch (geminiError) {
      console.warn(`Gemini LLM failed for ${itemCategory}. Falling back to DeepSeek.`, geminiError?.message || geminiError);
      try {
        queries = await this.deepSeekAiService.generateRecommendations(itemCategory, itemName, itemContext);
        console.log(`[DeepSeek] Fallback recommendations for ${itemCategory} ("${itemName}") ctx="${itemContext || ''}":`, queries);
      } catch (deepSeekError) {
        console.error(`DeepSeek also failed for ${itemCategory}.`, deepSeekError?.message || deepSeekError);
        throw deepSeekError;
      }
    }

    const cleaned = cleanAndDedupeQueries(queries, itemName);
    console.log(`[LLM] Final normalized queries for ${itemCategory} ("${itemName}") ctx="${itemContext || ''}":`, cleaned);
    return cleaned;
  }

  async recommendMovies(itemName, limit = 10) {
    try {
      const queries = await this._getRecommendedQueries('peliculas', itemName, '');
      const items = await this.movieStrategy.recommend(itemName, queries, limit);
      console.log('[recommendMovies] Final items:', items.map(i => i.title));
      return items;
    } catch (error) {
      console.error('Error in recommendMovies service:', error);
      return [];
    }
  }

  async recommendTvShows(itemName, limit = 10) {
    try {
      const queries = await this._getRecommendedQueries('series de televisión', itemName, '');
      const items = await this.tvStrategy.recommend(itemName, queries, limit);
      console.log('[recommendTvShows] Final items:', items.map(i => i.title));
      return items;
    } catch (error) {
      console.error('Error in recommendTvShows service:', error);
      return [];
    }
  }

  async recommendBooks(itemName, limit = 10) {
    try {
      const queries = await this._getRecommendedQueries('libros', itemName, '');
      const items = await this.bookStrategy.recommend(itemName, queries, limit);
      console.log('[recommendBooks] Final items:', items.map(i => i.title));
      return items;
    } catch (error) {
      console.error('Error in recommendBooks service:', error);
      return [];
    }
  }

  async recommendSongs(itemName, limit = 10) {
    try {
      // Try to enrich context from first Spotify search result (optional)
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'track');
      const baseSong = initialSearchResult?.[0];
      let itemContext = '';

      const queries = await this._getRecommendedQueries('canciones', itemName, itemContext);
      const items = await this.songStrategy.recommend(itemName, queries, limit);
      const finalItems = items.slice(0, limit);
      console.log('[recommendSongs] Final items:', finalItems.map(i => i.title));
      return finalItems;
    } catch (error) {
      console.error('Error in recommendSongs service:', error);
      return [];
    }
  }

  async recommendArtists(itemName, limit = 10) {
    try {
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'artist');
      const baseArtist = initialSearchResult?.[0];
      let itemContext = '';
      if (baseArtist && baseArtist.description) {
        const genresMatch = baseArtist.description.match(/Géneros: ([^.]+)/);
        if (genresMatch && genresMatch[1]) {
          const genresArray = genresMatch[1].split(',').map(g => g.trim());
          if (genresArray.length > 0) itemContext = `del género ${genresArray[0]}`;
        }
      }

      const queries = await this._getRecommendedQueries('artistas', itemName, itemContext);
      const items = await this.artistStrategy.recommend(itemName, queries, limit);
      const finalItems = items.slice(0, limit);
      console.log('[recommendArtists] Final items:', finalItems.map(i => i.title));
      return finalItems;
    } catch (error) {
      console.error('Error in recommendArtists service:', error);
      return [];
    }
  }

  async recommendAlbums(itemName, limit = 10) {
    try {
      const initialSearchResult = await this.searchService.searchSpotify(itemName, 'album');
      const baseAlbum = initialSearchResult?.[0];
      let itemContext = '';
      if (baseAlbum && baseAlbum.description) {
        const artistMatch = baseAlbum.description.match(/Artista\(s\): ([^.]+\.)/);
        if (artistMatch && artistMatch[1]) itemContext = `del artista ${artistMatch[1].replace(/\.$/, '')}`;
      }

      const queries = await this._getRecommendedQueries('álbumes', itemName, itemContext);
      const items = await this.albumStrategy.recommend(itemName, queries, limit);
      const finalItems = items.slice(0, limit);
      console.log('[recommendAlbums] Final items:', finalItems.map(i => i.title));
      return finalItems;
    } catch (error) {
      console.error('Error in recommendAlbums service:', error);
      return [];
    }
  }

  async recommendVideogames(itemName, limit = 10) {
    try {
      const initialSearchResult = await this.searchService.searchIgdb(itemName);
      const baseVideogame = initialSearchResult?.[0];
      let itemContext = '';
      if (baseVideogame) {
        if (baseVideogame.genres && Array.isArray(baseVideogame.genres) && baseVideogame.genres.length > 0) {
          itemContext = `del género ${baseVideogame.genres[0]}`;
        } else if (baseVideogame.description) {
          const genresMatch = baseVideogame.description.match(/Géneros: ([^.]+)/);
          if (genresMatch && genresMatch[1]) {
            const genresArray = genresMatch[1].split(',').map(g => g.trim());
            if (genresArray.length > 0) itemContext = `del género ${genresArray[0]}`;
          }
        }
      }

      const queries = await this._getRecommendedQueries('videojuegos', itemName, itemContext);
      const items = await this.videogameStrategy.recommend(itemName, queries, limit);
      const finalItems = items.slice(0, limit);
      console.log('[recommendVideogames] Final items:', finalItems.map(i => i.title));
      return finalItems;
    } catch (error) {
      console.error('Error in recommendVideogames service:', error);
      return [];
    }
  }

  async recommendMix(itemName, limit = 10) {
    try {
      const recommendationPromises = [];
      const addedExternalIds = new Set();
      let allMixedItems = [];

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

      for (let i = allMixedItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allMixedItems[i], allMixedItems[j]] = [allMixedItems[j], allMixedItems[i]];
      }

      const finalSlice = allMixedItems.slice(0, limit);
      console.log('[recommendMix] Final items:', finalSlice.map(i => `${i.type}:${i.title}`));
      return finalSlice;
    } catch (error) {
      console.error('Error in recommendMix service:', error);
      return [];
    }
  }
}

module.exports = RecommendationService;