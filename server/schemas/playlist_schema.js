const Joi = require('joi');

const id = Joi.number().integer();
const ownerUserId = Joi.number().integer();
const name = Joi.string().min(1).max(40);;
const description = Joi.string().max(500);
const isCollaborative = Joi.bool();

const createPlaylistSchema = Joi.object({
    ownerUserId: ownerUserId.required(),
    name: name.required(),
    description: description.optional(),
    isCollaborative: isCollaborative.optional(), // Opcional, pero explícito
  });
  
  const updatePlaylistSchema = Joi.object({
    ownerUserId: ownerUserId.optional(),
    name: name.optional(),
    description: description.optional(),
    isCollaborative: isCollaborative.optional(),
  });
  
  const getPlaylistSchema = Joi.object({
    id: id.required()
  });
  
  module.exports = { createPlaylistSchema, updatePlaylistSchema, getPlaylistSchema }