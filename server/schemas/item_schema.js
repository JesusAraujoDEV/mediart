const Joi = require('joi');

const id = Joi.number().integer();
const title = Joi.string();
const type = Joi.string().valid('movie', 'song', 'artist', 'tvshow', 'book', 'videogames');
const description = Joi.string().max(500);
const cover_url = Joi.string().max(255);
const release_date = Joi.date();
const external_id = Joi.number().integer();
const avg_rating = Joi.number().float();
const vibe_tags = Joi.array().items(Joi.string());

const createItemSchema = Joi.object({
    title: title.required(),
    type: type.required(),
    description: description.optional(),
    cover_url: cover_url.optional(), // Opcional, pero explícito
    release_date: release_date.optional(),
    external_id: external_id.optional(),
    avg_rating: avg_rating.optional(),
    vibe_tags: vibe_tags.optional(),
  });
  
  const updateItemSchema = Joi.object({
    ttitle: title.optional(),
    type: type.optional(),   
    description: description.optional(),
    cover_url: cover_url.optional(),
    release_date: release_date.optional(),
    external_id: external_id.optional(),
    avg_rating: avg_rating.optional(),
    vibe_tags: vibe_tags.optional(),
  });
  
  const getItemSchema = Joi.object({
    id
  });
  
  module.exports = { createItemSchema, updateItemSchema, getItemSchema }