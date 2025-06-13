const express = require('express');

const PlaylistService = require('./../services/playlist_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updatePlaylistSchema, createPlaylistSchema, getPlaylistSchema } = require('./../schemas/playlist_schema');
const passport = require('passport');
const { addItemsToPlaylistUnifiedSchema } = require('../schemas/playlist_item_schema');

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
      const bodyWithUserId = {
        ...req.body, 
        ownerUserId: req.user.sub // Sobreescribe o añade el userId del token
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

// AÑADIR ITEMS
router.post(
  '/:id/items', // :id es el ID de la playlist
  passport.authenticate('jwt', { session: false }), // 1. Protege la ruta con JWT
  validatorHandler(getPlaylistSchema, 'params'), // 2. Valida que el ID de la playlist en los params sea un número
  validatorHandler(addItemsToPlaylistUnifiedSchema, 'body'), // 3. Valida el cuerpo de la solicitud (itemId o itemIds)
  async (req, res, next) => {
    try {
      const { id: playlistId } = req.params;
      const { itemId, itemIds } = req.body;
      const userId = req.user.sub;

      // --- Lógica de Autorización: Obtener la playlist y verificar si el usuario autenticado es el dueño ---
      const playlist = await service.findOne(playlistId);

      if (playlist.ownerUserId !== userId) {
        throw boom.forbidden('You are not the owner of this playlist.');
      }
      // --- Fin Lógica de Autorización ---

      let rta;
      if (itemId) {
        // PASAMOS EL OBJETO 'playlist' AL SERVICIO
        rta = await service.addItemToPlaylist(playlist, itemId);
      } else if (itemIds && itemIds.length > 0) {
        // PASAMOS EL OBJETO 'playlist' AL SERVICIO
        rta = await service.addItemsToPlaylist(playlist, itemIds);
      } else {
        throw boom.badRequest('Must provide itemId or itemIds.');
      }

      res.status(201).json(rta);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
