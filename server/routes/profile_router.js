const express = require('express');
const passport = require('passport');
const PlaylistService = require('./../services/playlist_service');
const UserService = require('./../services/user_service');


const router = express.Router();

const playlistService = new PlaylistService();
const userService = new UserService();

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

module.exports = router;
