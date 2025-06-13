
const Joi = require('joi');

const itemId = Joi.number().integer();
const itemIds = Joi.array().items(Joi.number().integer());

const addItemsToPlaylistUnifiedSchema = Joi.object().keys({
    itemId: itemId,
    itemIds: itemIds
}).xor('itemId', 'itemIds'); // Esto asegura que solo uno de los dos campos (itemId O itemIds) esté presente

module.exports = {
  addItemsToPlaylistUnifiedSchema
};