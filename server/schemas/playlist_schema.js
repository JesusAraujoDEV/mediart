const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(1).max(100);
const description = Joi.string().allow(null, '').max(500);
const isCollaborative = Joi.boolean().optional();
const thumbnailUrl = Joi.string().allow(null, '').max(255);

const createPlaylistSchema = Joi.object({
  name: name.required(),
  description: description.optional(),
  isCollaborative: isCollaborative.optional(),
  thumbnailUrl: thumbnailUrl.optional()
});

const updatePlaylistSchema = Joi.object({
  name: name,
  description: description,
  isCollaborative: isCollaborative,
  thumbnailUrl: thumbnailUrl
});

const getPlaylistSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createPlaylistSchema,
  updatePlaylistSchema,
  getPlaylistSchema
};