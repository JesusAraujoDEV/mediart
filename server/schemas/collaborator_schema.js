const Joi = require('joi');

const userId = Joi.number().integer();
const playlistId = Joi.number().integer();

const addCollaboratorsSchema = Joi.object()
  .xor('userId', 'userIds')
  .keys({
    userId: userId.optional(),
    userIds: Joi.array().items(userId.required()).min(1).optional()
  });


const removeCollaboratorSchema = Joi.object({
  userId: userId.required()
});

module.exports = {
  addCollaboratorsSchema,
  removeCollaboratorSchema,
};