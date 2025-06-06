const Joi = require('joi');

const id = Joi.number().integer();
const title = Joi.string();
const type = Joi.string().valid('movie', 'song', 'artist', 'tvshow', 'book', 'videogames');
const description = Joi.string().max(500);
const coverUrl = Joi.string().max(255);
const releaseDate = Joi.date();
const externalId = Joi.number().integer();
const avgRating = Joi.number().float();
const vibeTags = Joi.array().items(Joi.string());

const createItemSchema = Joi.object({
    title: title.required(),
    type: type.required(),
    description: description.optional(),
    coverUrl: coverUrl.optional(),
    releaseDate: releaseDate.optional(), 
    externalId: externalId.optional(),
    avgRating: avgRating.optional(),
    vibeTags: vibeTags.optional(),
});

const updateItemSchema = Joi.object({
    title: title.optional(),
    type: type.optional(),
    description: description.optional(),
    coverUrl: coverUrl.optional(),
    releaseDate: releaseDate.optional(),
    externalId: externalId.optional(),
    avgRating: avgRating.optional(),
    vibeTags: vibeTags.optional(),
});

const getItemSchema = Joi.object({
    id: id.required()
});

module.exports = { createItemSchema, updateItemSchema, getItemSchema };