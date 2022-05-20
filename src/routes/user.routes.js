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
	/*authController.validateToken,*/
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

router.get(
	'/api/user',
	userController.getAllUsers
);

router.put(
	'/api/user/:userId',
	authController.validateToken,
	userController.validateUpdateUser,
	userController.updateUserFromId
);

router.delete('/api/user/:userId', userController.deleteUserFromId);

module.exports = router;
