const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.controller');

router.post('/', controller.createItem);
router.get('/items', controller.getAllItems);
router.get('/search', controller.searchItems);
router.get('/user/:userId', controller.getUserItems);
router.get('/type/:type', controller.getItemsByType);
router.get('/:id', controller.getItemById);
router.patch('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

module.exports = router;
