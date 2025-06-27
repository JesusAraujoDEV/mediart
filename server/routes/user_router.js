const express = require('express');
const UserService = require('./../services/user_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updateUserSchema, createUserSchema, getUserSchema, getUserByUsernameSchema, getUserQuerySchema } = require('./../schemas/user_schema');
const { uploadProfilePicture } = require('./../utils/multer_config'); // Multer para memoria
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
  uploadProfilePicture.single('profilePicture'),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      let profilePictureBuffer = null;

      if (req.file) {
        profilePictureBuffer = req.file.buffer; // El buffer del archivo subido
      }
      
      // Pasar el buffer y los otros datos al servicio
      const newUser = await service.create(body, profilePictureBuffer);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  uploadProfilePicture.single('profilePicture'), // Multer espera un campo 'profilePicture'
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const userIdFromToken = req.user.sub;

      if (parseInt(id, 10) !== parseInt(userIdFromToken, 10)) {
        throw boom.forbidden('You can only update your own profile.');
      }

      let profilePictureBuffer = null;
      if (req.file) {
        profilePictureBuffer = req.file.buffer; // El buffer del nuevo archivo
      }

      // `body.profilePictureUrl` desde el frontend se usará para indicar si se quiere eliminar
      // Si el frontend envía `profilePictureUrl: ''` significa eliminar.
      // Si se envía un archivo nuevo, `profilePictureBuffer` tendrá el buffer.
      // Si no se envía ni archivo ni `profilePictureUrl: ''`, la URL actual se mantiene.
      const user = await service.update(id, body, profilePictureBuffer);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }), // Protección para la eliminación
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userIdFromToken = req.user.sub;

      // Asegurarse de que el usuario solo pueda eliminar su propio perfil
      if (parseInt(id, 10) !== parseInt(userIdFromToken, 10)) {
        throw boom.forbidden('You can only delete your own profile.');
      }

      await service.delete(id);
      res.status(200).json({id, message: 'User deleted successfully'}); // Cambié a 200 y añadí mensaje
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;