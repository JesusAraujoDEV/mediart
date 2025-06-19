const Joi = require('joi');

const id = Joi.number().integer();
const title = Joi.string();
const type = Joi.string().valid('movie', 'song', 'artist', 'album', 'tvshow', 'book', 'videogame').required();
const description = Joi.string().max(5000).allow(null, '');
const coverUrl = Joi.string().uri().max(255).allow(null, '');
const releaseDate = Joi.date().iso().allow(null);
const externalId = Joi.string().required();
const externalSource = Joi.string().valid('Spotify', 'TMDB', 'IGDB', 'Google Books').required();
const avgRating = Joi.number().min(0).max(100).allow(null);
const externalUrl = Joi.string().uri().max(255).allow(null, '');

const createItemSchema = Joi.object({
    title: title,
    type: type,
    description: description,
    coverUrl: coverUrl,
    releaseDate: releaseDate,
    externalId: externalId,
    externalSource: externalSource,
    avgRating: avgRating,
    externalUrl: externalUrl,
});

const updateItemSchema = Joi.object({
    title: title.optional(),
    type: type.optional(),
    description: description.optional(),
    coverUrl: coverUrl.optional(),
    releaseDate: releaseDate.optional(),
    externalId: externalId.optional(),
    externalSource: externalSource.optional(),
    avgRating: avgRating.optional(),
    externalUrl: externalUrl.optional(),
});

const getItemSchema = Joi.object({
    id: id.required()
});

module.exports = {
  createItemSchema,
  updateItemSchema,
  getItemSchema,
  id,
  title,
  type,
  description,
  coverUrl,
  releaseDate,
  externalId,
  externalSource,
  avgRating,
  externalUrl,
};