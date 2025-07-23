// routes/user.router.js
const express = require('express');
const UserService = require('./../services/user_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updateUserSchema, createUserSchema, getUserSchema, getUserByUsernameSchema, getUserQuerySchema } = require('./../schemas/user_schema');
const { uploadProfilePicture } = require('./../utils/multer_config');
const passport = require('passport');
const boom = require('@hapi/boom');
const { checkMasterApiKey, authenticateIfNoApiKey } = require('./../middlewares/auth_handler'); // Importa SOLO checkMasterApiKey si no usas los otros aquí

const router = express.Router();
const service = new UserService();

// Ruta para obtener todos los usuarios (accesible con JWT o con Master API Key)
router.get('/',
    checkMasterApiKey,
    authenticateIfNoApiKey,
    async (req, res, next) => {
        try {
            console.log('req.user en la ruta GET /users:', req.user); // Verás { id: null, sub: null } si usas API Key
            const users = await service.find();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/',
    checkMasterApiKey, // Si usas la API Key, esto permitirá el acceso
    uploadProfilePicture.single('profilePicture'),
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            let profilePictureBuffer = null;

            if (req.file) {
                profilePictureBuffer = req.file.buffer;
            }
            
            const newUser = await service.create(body, profilePictureBuffer);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
);


// Ruta para actualizar un usuario (Propio usuario o Master API Key)
router.patch(
    '/:id',
    validatorHandler(getUserSchema, 'params'),
    checkMasterApiKey,
    authenticateIfNoApiKey,
    uploadProfilePicture.single('profilePicture'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const userIdFromToken = req.user.sub; // ID del usuario autenticado por JWT o null si es Master API Key

            // Si req.user.sub es null, significa que estamos usando la Master API Key.
            // En ese caso, permitimos la operación sin verificar el ID.
            if (userIdFromToken !== null) { // Si NO es el usuario ficticio de la API Key
                 if (parseInt(id, 10) !== parseInt(userIdFromToken, 10)) {
                    throw boom.forbidden('You can only update your own profile.');
                }
            }

            let profilePictureBuffer = null;
            if (req.file) {
                profilePictureBuffer = req.file.buffer;
            }

            const user = await service.update(id, body, profilePictureBuffer);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para eliminar un usuario (Propio usuario o Master API Key)
router.delete('/:id',
    validatorHandler(getUserSchema, 'params'),
    checkMasterApiKey, // Primero verifica si hay Master API Key
    authenticateIfNoApiKey, // Si no hay Master API Key, autentica con JWT
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const userIdFromToken = req.user.sub; // ID del usuario autenticado por JWT o null si es Master API Key

            // Si req.user.sub es null, significa que estamos usando la Master API Key.
            // En ese caso, permitimos la operación sin verificar el ID.
            if (userIdFromToken !== null) { // Si NO es el usuario ficticio de la API Key
                if (parseInt(id, 10) !== parseInt(userIdFromToken, 10)) {
                    throw boom.forbidden('You can only delete your own profile.');
                }
            }

            await service.delete(id);
            res.status(200).json({id, message: 'User deleted successfully'});
        } catch (error) {
            next(error);
        }
    }
);

// Rutas GET por ID o username (públicas por defecto o puedes proteger si lo necesitas)
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



module.exports = router;