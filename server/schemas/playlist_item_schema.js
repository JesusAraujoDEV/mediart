
const Joi = require('joi');

const itemId = Joi.number().integer();
const itemIds = Joi.array().items(Joi.number().integer());
const itemType = Joi.string().valid('movie', 'tvshow', 'book', 'song', 'artist', 'album', 'videogame').required();
const externalId = Joi.string().required();
const title = Joi.string().required();
const imageUrl = Joi.string().uri().allow(null, '');
const externalUrl = Joi.string().uri().allow(null, '');
const description = Joi.string().allow(null, '');
const releaseDate = Joi.string().allow(null, '');
const artistNames = Joi.string().allow(null, '');
const genreNames = Joi.string().allow(null, '');
const platformNames = Joi.string().allow(null, '');

const addPlaylistItemSchema = Joi.object({
  itemId: itemId.required(),
});

const addPlaylistItemsSchema = Joi.object({
  itemIds: itemIds.required(),
});

const addItemsToPlaylistUnifiedSchema = Joi.alternatives().try(
  addPlaylistItemSchema,
  addPlaylistItemsSchema
);

const itemDetailsSchema = Joi.object({
  type: itemType,
  externalId: externalId,
  title: title,
  imageUrl: imageUrl, // <-- Cambiado de `poster_url` a `imageUrl` si tu Item model usa `imageUrl`
  externalUrl: externalUrl,
  description: description,
  releaseDate: releaseDate,
  artistNames: artistNames,
  genreNames: genreNames,
  platformNames: platformNames,
  vote_average: Joi.number().allow(null),
  followers: Joi.number().allow(null),
  duration_ms: Joi.number().allow(null),
  popularity: Joi.number().allow(null),
});

const addRecommendedItemsToPlaylistSchema = Joi.object({
  items: Joi.array().items(itemDetailsSchema).min(1).required(),
});

module.exports = {
  addItemsToPlaylistUnifiedSchema,
  addRecommendedItemsToPlaylistSchema,
};