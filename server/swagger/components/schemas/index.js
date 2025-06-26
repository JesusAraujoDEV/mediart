// server/swagger/components/schemas/index.js

const userSchemas = require('./user_swagger_schema');
const authSchemas = require('./auth_swagger_schema');
const searchSchemas = require('./search_swagger_schema');
const recommendationSchemas = require('./recommendation_swagger_schema');
const playlistSchemas = require('./playlist_swagger_schema');
const itemSchemas = require('./item_swagger_schema');

// const playlistSchemas = require('./playlist_swagger_schema'); // Cuando lo crees

module.exports = {
  ...userSchemas,
  ...authSchemas,
  ...searchSchemas,
  ...recommendationSchemas,
  ...playlistSchemas,
  ...itemSchemas
  // ...playlistSchemas, // Descomenta cuando lo crees
  // ... (otros schemas)
};