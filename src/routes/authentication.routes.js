// Authentication routes
const router = require('express').Router();
const AuthController = require('../controllers/authentication.controller');

router.post('/auth/login', AuthController.validateLogin, AuthController.login);

module.exports = router;
