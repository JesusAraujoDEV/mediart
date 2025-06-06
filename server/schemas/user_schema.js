const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string().min(3).max(20);
const email = Joi.string().email();
const password_hash = Joi.string();
const profile_picture_url = Joi.string().max(255);
const bio = Joi.string().max(600);


const createUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  password_hash: password_hash.required(),
  profile_picture_url: profile_picture_url.optional(), // Opcional, pero explícito
  bio: bio.optional()  
});

const updateUserSchema = Joi.object({
  username: username,
  email: email,
  password_hash: password_hash,
  profile_picture_url: profile_picture_url,
  bio: bio
});

const getUserSchema = Joi.object({
  id
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
