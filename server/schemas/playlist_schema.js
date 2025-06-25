const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(1).max(100);
const description = Joi.string().allow(null, '').max(500);
const isCollaborative = Joi.boolean().optional();
const thumbnailUrl = Joi.string().allow(null, '').max(255);

const playlistItemSchema = Joi.object({
    type: Joi.string().valid('movie', 'tvshow', 'book', 'song', 'artist', 'album', 'videogame').required(),
    externalSource: Joi.string().required(), // Ej. "TMDB", "Spotify", "Google Books", "IGDB"
    title: Joi.string().required(),
    description: Joi.string().allow(null, '').optional(),
    coverUrl: Joi.string().uri().allow(null, '').optional(),
    releaseDate: Joi.string().allow(null, '').optional(), // O Joi.date() si conviertes
    externalId: Joi.string().required(),
    avgRating: Joi.number().allow(null).optional(),
    externalUrl: Joi.string().uri().allow(null, '').optional(),
});

const createPlaylistSchema = Joi.object({
    name: name.required(),
    description: description.optional(),
    isCollaborative: isCollaborative.optional(),
    thumbnailUrl: thumbnailUrl.optional(),
    items: Joi.array().items(playlistItemSchema).optional()
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

// Nota: No veo que uses addItemsToPlaylistUnifiedSchema en tu playlist_schema.js actual.
// Si lo tienes en playlist_item_schema.js, asegúrate de que esté bien definido allí.
// Por ahora, solo incluyo lo que tienes y el playlistItemSchema necesario.

module.exports = {
    createPlaylistSchema,
    updatePlaylistSchema,
    getPlaylistSchema,
    // No incluyo addItemsToPlaylistSchema si ya lo tienes en playlist_item_schema.js
    // Si lo necesitas aquí, asegúrate de definirlo como lo hicimos antes.
};