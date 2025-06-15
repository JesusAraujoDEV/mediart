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
      const { q } = req.query;

      const results = await searchService.searchAll(q);

      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;