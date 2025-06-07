const express = require('express');

const PlaylistsService = require('./../services/playlist_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updatePlaylistSchema, createPlaylistSchema, getPlaylistSchema } = require('./../schemas/playlist_schema');

const router = express.Router();
const service = new PlaylistsService();


router.get('/', async (req, res, next) => {
  try {
    const playlists = await service.find();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const playlist = await service.findOne(id);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createPlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newPlaylist = await service.create(body);
      res.status(201).json(newPlaylist);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(updatePlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const playlist = await service.update(id, body);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
