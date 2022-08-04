var express = require('express');
var authController = require('../controllers/authController');
var router = express.Router();

/**
 * Authentication routes
 */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refreshtoken', authController.refreshToken)
router.get('/verifyemail', authController.verifyEmail)

module.exports = router;
