// playlist_router.js
const express = require('express');
const PlaylistService = require('./../services/playlist_service');
const validatorHandler = require('./../middlewares/validator_handler');
const {
  getPlaylistSchema,
  createPlaylistSchema,
  updatePlaylistSchema
} = require('./../schemas/playlist_schema');
const {
  addItemsToPlaylistUnifiedSchema,
  removeItemFromPlaylistSchema
} = require('../schemas/playlist_item_schema');
const passport = require('passport');
const boom = require('@hapi/boom');
const { addCollaboratorSchema, addCollaboratorsSchema } = require('../schemas/collaborator_schema');
const { uploadPlaylistPicture } = require('./../utils/multer_config');
const { checkPlaylistOwnershipOrCollaboration } = require('../middlewares/auth_handler');

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

router.get('/:playlistId',
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const playlist = await service.findOne(playlistId);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  uploadPlaylistPicture.single('playlistCover'),
  validatorHandler(createPlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const bodyWithUserId = {
        ...body,
        ownerUserId: req.user.sub
      };

      let playlistCoverBuffer = null;
      if (req.file) {
        playlistCoverBuffer = req.file.buffer;
      }

      
      const newPlaylist = await service.create(bodyWithUserId, playlistCoverBuffer);
      res.status(201).json(newPlaylist);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:playlistId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  uploadPlaylistPicture.single('playlistCover'),
  validatorHandler(updatePlaylistSchema, 'body'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const body = req.body;
      const userId = req.user.sub;

      const playlist = await service.findOne(playlistId);
      // Verificar si el usuario autenticado es el dueño de la playlist
      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      let playlistCoverBuffer = null;
      if (req.file) {
        playlistCoverBuffer = req.file.buffer;
      }

      // `body.playlistCoverUrl` desde el frontend se usará para indicar si se quiere eliminar
      // Si el frontend envía `playlistCoverUrl: ''` significa eliminar.
      // Si se envía un archivo nuevo, `playlistCoverBuffer` tendrá el buffer.
      // Si no se envía ni archivo ni `playlistCoverUrl: ''`, la URL actual se mantiene.
      const updatedPlaylist = await service.update(playlistId, body, playlistCoverBuffer);
      res.json(updatedPlaylist);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:playlistId',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const userId = req.user.sub;

      const playlist = await service.findOne(playlistId);
      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }

      await service.delete(playlistId); // El servicio ahora se encarga de eliminar de ImgBB
      res.status(200).json({ playlistId, message: 'Playlist deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:playlistId/items',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  checkPlaylistOwnershipOrCollaboration,
  validatorHandler(addItemsToPlaylistUnifiedSchema, 'body'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const body = req.body;
      // Ya no necesitas obtener la playlist aquí, está en req.playlist
      const playlist = req.playlist; // <--- ¡La playlist ya está disponible!

      // La lógica de permisos ya fue manejada por checkPlaylistOwnershipOrCollaboration
      // if (playlist.ownerUserId !== userId && !isCollaborator) { ... } ya no es necesario aquí

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
  validatorHandler(removeItemFromPlaylistSchema, 'params'),
  checkPlaylistOwnershipOrCollaboration, // ¡NUEVO MIDDLEWARE AQUÍ!
  async (req, res, next) => {
    try {
      const { playlistId, itemId } = req.params;
      const playlist = req.playlist;

      // La lógica de permisos ya fue manejada por checkPlaylistOwnershipOrCollaboration
      // if (playlist.ownerUserId !== userId && !isCollaborator) { ... } ya no es necesario aquí

      const rta = await service.removeItemFromPlaylist(playlist, itemId);

      res.status(200).json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:playlistId/collaborators',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(addCollaboratorsSchema, 'body'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const { userId, userIds } = req.body;
      const currentUserId = req.user.sub;

      const playlist = await service.findOne(playlistId);

      if (!playlist.isCollaborative) {
        throw boom.badRequest('This playlist is not configured as collaborative.');
      }

      if (playlist.ownerUserId !== currentUserId) {
        throw boom.forbidden('You do not have permission to add collaborators to this playlist.');
      }

      let result;
      if (userId) {
        result = await service.addCollaborator(playlistId, userId);
      } else if (userIds && userIds.length > 0) {
        result = await service.addMultipleCollaborators(playlistId, userIds);
      } else {
        throw boom.badRequest('Must provide either "userId" or "userIds" to add collaborators.');
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:playlistId/collaborators/remove',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getPlaylistSchema, 'params'),
  validatorHandler(addCollaboratorsSchema, 'body'),
  async (req, res, next) => {
    try {
      const { playlistId } = req.params;
      const { userId, userIds } = req.body;
      const currentUserId = req.user.sub;

      const playlist = await service.findOne(playlistId);

      // Solo el dueño puede añadir/eliminar colaboradores
      if (playlist.ownerUserId !== currentUserId) {
        throw boom.forbidden('You do not have permission to manage collaborators for this playlist. Only the owner can perform this action.');
      }

      // La playlist debe ser colaborativa para gestionar colaboradores
      if (!playlist.isCollaborative) {
        throw boom.badRequest('This playlist is not configured as collaborative.');
      }

      let result;
      if (userId) {
        result = await service.removeCollaborator(playlistId, userId);
      } else if (userIds && userIds.length > 0) {
        result = await service.removeMultipleCollaborators(playlistId, userIds);
      } else {
        throw boom.badRequest('Must provide either "userId" (single user ID) or "userIds" (array of user IDs) to remove collaborators.');
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;