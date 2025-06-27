const express = require('express');
const UserService = require('./../services/user_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updateUserSchema, createUserSchema, getUserSchema, getUserByUsernameSchema, getUserQuerySchema } = require('./../schemas/user_schema');
const { uploadProfilePicture } = require('./../utils/multer_config');
const passport = require('passport');
const boom = require('@hapi/boom');

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/by-username/:username',
  validatorHandler(getUserByUsernameSchema, 'params'),
  validatorHandler(getUserQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const includeAssociationsParam = req.query.include;

      let associationsToInclude = [];
      if (includeAssociationsParam) {
        associationsToInclude = includeAssociationsParam.split(',').map(assoc => assoc.trim());
      }

      const user = await service.findOneByUsername(username, associationsToInclude);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  uploadProfilePicture.single('profilePicture'), // <-- Middleware de Multer para una sola imagen
  validatorHandler(createUserSchema, 'body'), // <-- El validador se ejecuta DESPUÉS de Multer
  async (req, res, next) => {
    try {
      const body = req.body;
      // Si se subió un archivo, Multer lo guarda en req.file
      if (req.file) {
        body.profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`; // Guarda la ruta relativa
      } else {
        // Si no hay archivo, asegúrate de que profilePictureUrl no se envíe si es opcional y no se especificó
        delete body.profilePictureUrl;
      }
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }), // Asegúrate de que el usuario esté autenticado para actualizar su perfil
  validatorHandler(getUserSchema, 'params'),
  uploadProfilePicture.single('profilePictureUrl'), // <-- Middleware de Multer para una sola imagen
  validatorHandler(updateUserSchema, 'body'), // <-- El validador se ejecuta DESPUÉS de Multer
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const userIdFromToken = req.user.sub; // ID del usuario autenticado

      // Asegurarse de que el usuario solo pueda actualizar su propio perfil
      if (parseInt(id, 10) !== parseInt(userIdFromToken, 10)) {
        throw boom.forbidden('You can only update your own profile.');
      }

      // Si se subió un archivo, Multer lo guarda en req.file
      if (req.file) {
        body.profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`; // Guarda la ruta relativa
      } else if (body.profilePictureUrl === '') {
         // Si se envía profilePictureUrl como cadena vacía, significa que quieren eliminar la foto de perfil
        body.profilePictureUrl = null;
      } else {
        // Si no se envía req.file y profilePictureUrl no es una cadena vacía,
        // significa que no se cambió la foto o se mantuvo la existente.
        // No hacer nada para preservar el valor existente en la BD.
        delete body.profilePictureUrl; // Evitar que se intente actualizar con 'undefined'
      }

      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
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
