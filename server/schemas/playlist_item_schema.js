const Joi = require('joi');
const {
  id: itemIdSchema,
  type,
  externalId,
  externalSource,
  title,
  description,
  coverUrl,
  releaseDate,
  avgRating,
  externalUrl,
} = require('./item_schema');

const addExistingItemsToPlaylistSchema = Joi.object({
  itemIds: Joi.array().items(itemIdSchema.required()).min(1).required(),
});

const recommendedItemSchema = Joi.object({
  type: type,
  externalSource: externalSource,
  title: title,
  description: description,
  coverUrl: coverUrl,
  releaseDate: releaseDate,
  externalId: externalId,
  avgRating: avgRating,
  externalUrl: externalUrl,
});

const addItemsToPlaylistUnifiedSchema = Joi.alternatives().try(
  addExistingItemsToPlaylistSchema,
  Joi.object({
    items: Joi.array().items(recommendedItemSchema).min(1).required(),
  })
);

module.exports = {
  addItemsToPlaylistUnifiedSchema,
  recommendedItemSchema,
};