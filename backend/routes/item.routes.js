const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.controller');

console.log('🔧 Registering item routes...');

// Create
router.post('/', controller.createItem);
console.log('✅ POST / registered');

// Read - Specific routes first
router.get('/items', controller.getAllItems);
console.log('✅ GET /items registered');

router.get('/search', controller.searchItems);
console.log('✅ GET /search registered');

router.get('/user/:userId', controller.getUserItems);
console.log('✅ GET /user/:userId registered');

router.get('/type/:type', controller.getItemsByType);
console.log('✅ GET /type/:type registered');

// Parameterized routes last
router.get('/:id', controller.getItemById);
console.log('✅ GET /:id registered');

// Update
router.patch('/:id', controller.updateItem);
console.log('✅ PATCH /:id registered');

// Delete
router.delete('/:id', controller.deleteItem);
console.log('✅ DELETE /:id registered');

console.log('🎯 All item routes registered successfully!');

module.exports = router;
