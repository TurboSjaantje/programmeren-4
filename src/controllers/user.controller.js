const assert = require("assert");
const { restart } = require("nodemon");

let database = [];
let id = 0;

let controller = {
	validateUser: (req, res, next) => {
		let user = req.body;

		let { name, emailAdress } = user;
		try {
			assert(typeof name === "string", "Title must be a string!");
			assert(
				typeof emailAdress === "string",
				"emailAdress must be a string!"
			);
			next();
		} catch (err) {
            console.log(err.code)
			console.log(err.message);
			res.status(400).json({
				status: 400,
				result: err.toString(),
			});
		}
	},
	addUser: (req, res) => {
		let user = req.body;
		console.log(user);
		user = {
			id,
			...user,
		};

		id++;

		let email = database.filter(
			(item) => item.emailAdress == user.emailAdress
		);
		if (email != 0) {
			res.status(404).json({
				status: 404,
				result: `The emailaddres: ${user.emailAdress}, has already been used!`,
			});
		} else {
			database.push(user);
			console.log(database);
			res.status(201).json({
				status: 201,
				result: user,
			});
		}
	},
	getUserFromId: (req, res) => {
		const userId = req.params.userId;
		const users = database.filter((item) => item.id == userId);

		if (users.length <= 0) {
			res.status(401).json({
				status: 401,
				result: `User with ID ${userId} not found`,
			});

			return;
		}

		const user = users[0];
		res.status(200).json({
			status: 200,
			result: user,
		});
	},
	getAllUsers: (req, res) => {
		res.status(202).json({
			status: 200,
			result: database,
		});
	},
	getUserProfileFromId: (req, res) => {
		res.status(401).json({
			status: 401,
			result: `Function is not yet implemented!`,
		});
	},
	updateUserFromId: (req, res) => {
		//get updated user
		let user = req.body;
		console.log(user);
		user = {
			id,
			...user,
		};

		const userId = req.params.userId;
		let users = database.filter((item) => item.id == userId);
		if (users.length != 0) {
			database[database.indexOf(users[0])] = user;
			res.status(205).json({
				status: 205,
				result: `User with ID: ${userId} updated succesfully`,
			});
		} else {
			res.status(404).json({
				status: 404,
				result: `Use with ID: ${userId} does not exist!`,
			});
		}
	},
	deleteUserFromId: (req, res) => {
		const userId = req.params.userId;
		let users = database.filter((item) => item.id == userId);
		if (users.length != 0) {
			database.splice(database.indexOf(users[0]), 1);
			res.status(206).json({
				status: 206,
				result: `User with ID: ${userId} deleted succesfully`,
			});
		} else {
			res.status(404).json({
				status: 404,
				result: `Use with ID: ${userId} does not exist!`,
			});
		}
	},
};

module.exports = controller;
