const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {config} = require('./../config/config');

const validatorHandler = require('../middlewares/validator_handler');
const { loginAuthSchema, recoveryAuthSchema, changePasswordAuthSchema } = require('./../schemas/auth_schema');

const AuthService = require('./../services/auth_service')
const service = new AuthService();

const router = express.Router();

router.post('/login',
  passport.authenticate('local', {session:false}),
  validatorHandler(loginAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery',
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecovery(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
