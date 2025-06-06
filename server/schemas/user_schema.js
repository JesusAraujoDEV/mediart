const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string().min(3).max(20);
const email = Joi.string().email();
const password_hash = Joi.string();
const profile_picture_url = Joi.string().max(255);
const bio = Joi.string().max(600);


const createUserSchema = Joi.object({
  username,
  email,
  password_hash,
  profile_picture_url,
  bio
});

const updateUserSchema = Joi.object({
  username,
  email,
  password_hash,
  profile_picture_url,
  bio
});

const getUserSchema = Joi.object({
  id
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
