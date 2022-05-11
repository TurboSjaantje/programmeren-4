const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", (req, res) => {
	res.status(200).json({
		status: 200,
		result: "Welcome to Share-a-meal API",
	});
});

router.post("/api/user", userController.validateUser, userController.addUser);

router.get("/api/user/:userId", userController.getUserFromId);

router.get("/api/user", userController.getAllUsers);

router.get("/api/user/profile", userController.getUserProfileFromId);

router.put("/api/user/:userId", userController.validateUser, userController.updateUserFromId);

router.delete("/api/user/:userId", userController.deleteUserFromId);

module.exports = router;
