// server/swagger/paths/index.js

const userPaths = require('./user_paths')
// const playlistPaths = require('./playlist_paths'); // Cuando lo crees

module.exports = {
  ...userPaths,
  // ...playlistPaths, // Descomenta cuando lo crees
  // ... (otras rutas)
};