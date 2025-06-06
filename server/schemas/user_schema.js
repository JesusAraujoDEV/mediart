const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string().min(3).max(20);
const email = Joi.string().email();
const passwordHash = Joi.string();
const profilePictureUrl = Joi.string().max(255);
const bio = Joi.string().max(600);


const createUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  passwordHash: passwordHash.required(),
  profilePictureUrl: profilePictureUrl.optional(), // Opcional, pero explícito
  bio: bio.optional()  
});

const updateUserSchema = Joi.object({
  username: username,
  email: email,
  passwordHash: passwordHash,
  profilePictureUrl: profilePictureUrl,
  bio: bio
});

const getUserSchema = Joi.object({
  id
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
