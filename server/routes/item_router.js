const express = require('express');

const ItemService = require('./../services/item_service');
const validatorHandler = require('./../middlewares/validator_handler');
const { updateItemSchema, createItemSchema, getItemSchema } = require('./../schemas/item_schema');

const router = express.Router();
const service = new ItemService();


router.get('/', async (req, res, next) => {
  try {
    const items = await service.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:itemId',
  validatorHandler(getItemSchema, 'params'),
  async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const items = await service.findOne(itemId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createItemSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.create(body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:itemId',
  validatorHandler(getItemSchema, 'params'),
  validatorHandler(updateItemSchema, 'body'),
  async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const body = req.body;
      const item = await service.update(itemId, body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:itemId',
  validatorHandler(getItemSchema, 'params'),
  async (req, res, next) => {
    try {
      const { itemId } = req.params;
      await service.delete(itemId);
      res.status(201).json({itemId});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
