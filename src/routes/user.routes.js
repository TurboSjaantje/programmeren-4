const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/authentication.controller');

router.get('/', (req, res) => {
	res.status(200).json({
		status: 200,
		result: 'Welcome to Share-a-meal API',
	});
});

router.post(
	'/api/user',
	userController.validateUser,
	userController.addUser
);

router.get(
	'/api/user/profile',
	authController.validateToken,
	userController.getUserProfileFromId
);

router.get(
	'/api/user/:userId',
	authController.validateToken,
	userController.getUserFromId
);

router.get('/api/user', authController.validateToken, userController.getAllUsers);

router.put(
	'/api/user/:userId',
	authController.validateToken,
	userController.validateUpdateUser,
	userController.updateUserFromId
);

router.delete(
	'/api/user/:userId',
	authController.validateToken,
	authController.validateOwnershipUser,
	userController.deleteUserFromId
);

module.exports = router;
