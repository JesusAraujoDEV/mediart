const Joi = require('joi');
const { recommendedItemSchema } = require('./playlist_item_schema');

const id = Joi.number().integer();
const ownerUserId = Joi.number().integer();
const name = Joi.string().min(1).max(40);
const description = Joi.string().max(500).allow(null, '');
const isCollaborative = Joi.bool();
const public = Joi.bool();

const createPlaylistSchema = Joi.object({
  name: name.required(),
  description: description.optional(),
  isCollaborative: isCollaborative.optional(),
  public: public.optional().default(true),
  items: Joi.array().items(recommendedItemSchema).min(1).optional(),
});

const updatePlaylistSchema = Joi.object({
  name: name.optional(),
  description: description.optional(),
  isCollaborative: isCollaborative.optional(),
  public: public.optional(),
});

const getPlaylistSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createPlaylistSchema,
  updatePlaylistSchema,
  getPlaylistSchema,
  id,
};