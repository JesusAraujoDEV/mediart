const Joi = require('joi');

const itemName = Joi.string().min(1).required();

const recommendItemSchema = Joi.object({
  itemName: itemName,
});

module.exports = { recommendItemSchema };