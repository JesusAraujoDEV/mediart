const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string().min(3).max(20);
const email = Joi.string().email();
const passwordHash = Joi.string().min(8);
const profilePictureUrl = Joi.string().allow(null, '').max(255);
const bio = Joi.string().max(600);

// Nombres de asociaciones permitidas
const allowedUserAssociations = [
  'ownedPlaylists',
  'savedPlaylists',
  'followersUsers',
  'followingUsers',
  'libraryEntries',
  'initiatedFollows',
  'receivedFollows',
  'collaboratorPlaylists'
];

const createUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  passwordHash: passwordHash.required(),
  profilePictureUrl: profilePictureUrl.optional(),
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
  id: id.required()
});

const getUserByUsernameSchema = Joi.object({
  username: username.required()
});

const getUserQuerySchema = Joi.object({
  include: Joi.string().custom((value, helpers) => {
    const associations = value.split(',').map(s => s.trim());
    const invalidAssociations = associations.filter(assoc => !allowedUserAssociations.includes(assoc));
    if (invalidAssociations.length > 0) {
      return helpers.message(`Invalid association(s) requested: ${invalidAssociations.join(', ')}. Allowed are: ${allowedUserAssociations.join(', ')}`);
    }
    return value;
  }).optional()
});

const getFollowedUserSchema = Joi.object({
  followedId: id.required()
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  getFollowedUserSchema,
  getUserByUsernameSchema,
  getUserQuerySchema
}