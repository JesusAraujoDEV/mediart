const Joi = require('joi');

const q = Joi.string().min(1);

const searchQuerySchema = Joi.object({
  q: q.required(),
});

module.exports = { searchQuerySchema };