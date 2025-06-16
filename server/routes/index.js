const express = require('express');

const usersRouter = require('./user_router');
const itemsRouter = require('./item_router');
const playlistsRouter = require('./playlist_router');
const authRouter = require('./auth_router');
const profileRouter = require('./profile_router');
const searchRouter = require('./search_router');
const recommendationRouter = require('./recommendation_router');


function routerApi(app){
  const router = express.Router();
  app.use('/api', router);
  router.use('/users', usersRouter);
  router.use('/items', itemsRouter);
  router.use('/playlists', playlistsRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
  router.use('/search', searchRouter);
  router.use('/recommendation', recommendationRouter);

}

module.exports = routerApi;
