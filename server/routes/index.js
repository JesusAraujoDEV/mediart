const express = require('express');

const usersRouter = require('./user_router');
const itemsRouter = require('./item_router');
const playlistsRouter = require('./playlist_router');
const authRouter = require('./auth_router');


function routerApi(app){
  const router = express.Router();
  app.use('/api', router);
  router.use('/users', usersRouter);
  router.use('/items', itemsRouter);
  router.use('/playlists', playlistsRouter);
  router.use('/auth', authRouter);

}

module.exports = routerApi;
