const express = require('express');
const passport = require('passport');
const PlaylistService = require('./../services/playlist_service');
const UserService = require('./../services/user_service');
const validatorHandler = require('../middlewares/validator_handler');
const {createPlaylistSchema, getPlaylistSchema, updatePlaylistSchema} = require('./../schemas/playlist_schema');
const { getUserSchema, getFollowedUserSchema } = require('../schemas/user_schema');


const router = express.Router();

const playlistService = new PlaylistService();
const userService = new UserService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;

      const user = await userService.findOne(userId, false);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
    '/owned-playlists',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        const userId = req.user.sub;
  
        const ownedPlaylists = await playlistService.findByOwner(userId);
  
        res.json(ownedPlaylists);
      } catch (error) {
        next(error);
      }
    }
);

router.get(
  '/saved-playlists',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;

      const savedPlaylists = await userService.findSavedPlaylistsByUserId(userId);

      res.json(savedPlaylists);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/saved-playlists/:playlistId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const { playlistId: playlistId } = req.params;

      const rta = await userService.savePlaylist(userId, playlistId);

      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/saved-playlists/:playlistId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const { playlistId: playlistId } = req.params;

      const rta = await userService.unsavePlaylist(userId, playlistId);

      res.status(200).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/my-followers',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;

      const followerUsers = await userService.findMyFollowers(userId);

      res.json(followerUsers);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/my-followings',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;

      const followingUsers = await userService.findMyFollowings(userId);

      res.json(followingUsers);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/follow/:followedId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getFollowedUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const followerUserId = req.user.sub;
      const { followedId } = req.params;

      const rta = await userService.followUser(parseInt(followerUserId), parseInt(followedId));

      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/follow/:followedId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getFollowedUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const followerUserId = req.user.sub;
      const { followedId } = req.params;

      const rta = await userService.unfollowUser(parseInt(followerUserId), parseInt(followedId));

      res.status(200).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
