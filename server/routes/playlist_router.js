const express = require('express');
const PlaylistService = require('./../services/playlist_service');
const validatorHandler = require('./../middlewares/validator_handler');
const {
  getPlaylistSchema,
  createPlaylistSchema,
  updatePlaylistSchema
} = require('./../schemas/playlist_schema');
const {
  addItemsToPlaylistUnifiedSchema
} = require('../schemas/playlist_item_schema');
const passport = require('passport');
const boom = require('@hapi/boom');
const { addCollaboratorSchema, addCollaboratorsSchema } = require('../schemas/collaborator_schema');

const router = express.Router();
const service = new PlaylistService();


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
  passport.authenticate('jwt', { session: false }),
  validatorHandler(createPlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const bodyWithUserId = {
        ...body,
        ownerUserId: req.user.sub
      };
      console.log(bodyWithUserId);
      const newPlaylist = await service.create(bodyWithUserId);
      res.status(201).json(newPlaylist);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(updatePlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const userId = req.user.sub; // Obtener el ID del usuario autenticado

      const playlist = await service.findOne(id);
      // Verificar si el usuario autenticado es el dueño de la playlist
      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      const updatedPlaylist = await service.update(id, body);
      res.json(updatedPlaylist);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.sub;

      const playlist = await service.findOne(id);
      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      await service.delete(id);
      res.status(200).json({ id, message: 'Playlist deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:id/items',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(addItemsToPlaylistUnifiedSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id: playlistId } = req.params;
      const body = req.body;
      const userId = req.user.sub;

      const playlist = await service.findOne(playlistId);

      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      let rta;
      if (body.itemIds) {
        rta = await service.addExistingItemsToPlaylist(playlist, body.itemIds);
      } else if (body.items && Array.isArray(body.items) && body.items.length > 0) {
        rta = await service.addItemsToPlaylist(playlist, body.items);
      } else {
        throw boom.badRequest('Request body must contain either "itemIds" (array of existing item IDs) or "items" (array of item objects to add/create).');
      }

      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:playlistId/items/:itemId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { playlistId, itemId } = req.params;
      const userId = req.user.sub;

      const playlist = await service.findOne(playlistId);

      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      const rta = await service.removeItemFromPlaylist(playlist, itemId);

      res.status(200).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:id/collaborators',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(addCollaboratorsSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId, userIds } = req.body;
      const currentUserId = req.user.sub;

      const playlist = await service.findOne(id);

      if (!playlist.isCollaborative) {
        throw boom.badRequest('This playlist is not configured as collaborative.');
      }

      if (playlist.ownerUserId !== currentUserId) {
        throw boom.forbidden('You do not have permission to add collaborators to this playlist.');
      }

      let result;
      if (userId) {
        result = await service.addCollaborator(id, userId);
      } else if (userIds && userIds.length > 0) {
        result = await service.addMultipleCollaborators(id, userIds);
      } else {
        throw boom.badRequest('Must provide either "userId" or "userIds" to add collaborators.');
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;