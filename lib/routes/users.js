var express = require('express');
var userController = require('../controllers/userController');
var router = express.Router();

/**
 * User routes
 */
router.get('/', userController.getUsers);

module.exports = router;