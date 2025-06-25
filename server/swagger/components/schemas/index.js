// server/swagger/components/schemas/index.js

const userSchemas = require('./user_swagger_schema');
// const playlistSchemas = require('./playlist_swagger_schema'); // Cuando lo crees

module.exports = {
  ...userSchemas,
  // ...playlistSchemas, // Descomenta cuando lo crees
  // ... (otros schemas)
};