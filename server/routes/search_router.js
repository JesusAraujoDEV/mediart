// routes/search_router.js
const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator_handler');
const { searchQuerySchema } = require('../schemas/search_schema');
const SearchService = require('../services/search_service');

const router = express.Router();
const searchService = new SearchService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(searchQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { q, type } = req.query;

      let results;
      if (type && type !== 'general') {
        // Si se especifica un tipo, llamar al método específico del servicio
        switch (type) {
          case 'movie':
            results = await searchService.searchTmdb(q);
            results = { movies: results.movies || [] };
            break;
          case 'tvshow':
            results = await searchService.searchTmdb(q);
            results = { tvshows: results.tvshows || [] };
            break;
          case 'song':
            results = await searchService.searchSpotify(q);
            results = { songs: results.songs || [] };
            break;
          case 'artist':
            results = await searchService.searchSpotify(q);
            results = { artists: results.artists || [] };
            break;
          case 'album':
            results = await searchService.searchSpotify(q);
            results = { albums: results.albums || [] };
            break;
          case 'videogame':
            results = { videogames: await searchService.searchIgdb(q) };
            break;
          case 'book':
            results = { books: await searchService.searchGoogleBooks(q) };
            break;
          default:
            results = await searchService.searchAll(q);
            break;
        }
      } else {
        results = await searchService.searchAll(q);
      }

      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(searchQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const users = await searchService.searchUsersByUsername(q);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;