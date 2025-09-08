// schemas/search_schema.js
const Joi = require('joi');

const q = Joi.string().min(1).required();

const allowedTypes = [
  'movie',
  'tvshow',
  'song',
  'artist',
  'album',
  'videogame',
  'book',
  'general',
  'rawg'
];

const searchQuerySchema = Joi.object({
  q: q,
  type: Joi.string().valid(...allowedTypes).optional(),
});

module.exports = { searchQuerySchema };