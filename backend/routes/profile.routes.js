const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

router.get('/', controller.getProfile);
router.patch('/', controller.updateProfile);
router.delete('/', controller.deleteProfile);

module.exports = router;
