const Joi = require('joi');

const email = Joi.string().email();
const password = Joi.string().min(8);
const newPassword = Joi.string().min(8);
const token = Joi.string().regex(
  /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
);

const loginAuthSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

const recoveryAuthSchema = Joi.object({
  email: email.required(),
});

const changePasswordAuthSchema = Joi.object({
  token: token.required(),
  newPassword: newPassword.required(),
});

module.exports = { loginAuthSchema, recoveryAuthSchema, changePasswordAuthSchema };