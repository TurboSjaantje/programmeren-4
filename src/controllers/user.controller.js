const dbconnection = require('../../database/dbconnection');
const assert = require('assert');
const { is } = require('express/lib/request');

let controller = {
	validateUser: (req, res, next) => {
		let user = req.body;

		let {
			firstName,
			lastName,
			isActive,
			emailAdress,
			password,
			phoneNumber,
			roles,
			street,
			city,
		} = user;
		try {
			// assert.match(
			// 	password,
			// 	/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
			// 	'Password must contain 8-15 characters which contains at least one lower- and uppercase letter, one special character and one digit'
			// );
			assert(
				typeof emailAdress === 'string',
				'emailAdress cannot be null!'
			);
			assert.match(
				emailAdress,
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Invalid emailadres'
			);
			assert(typeof firstName === 'string', 'First Name cannot be null!');
			assert(typeof lastName === 'string', 'Last Name cannot be null!');
			//assert(typeof isActive === 'number', 'isActive cannot be null!');
			assert(
				typeof phoneNumber === 'string',
				'Phonenumber cannot be null!'
			);
			assert.match(
				phoneNumber,
				/^\d{10}$/,
				'Phonenumber should be 10 digits'
			);
			assert(typeof password === 'string', 'Password cannot be null!');
			//assert(typeof roles === 'string', 'Roles cannot be null!');
			assert(typeof street === 'string', 'Street cannot be null!');
			assert(typeof city === 'string', 'City cannot be null!');
			next();
		} catch (err) {
			const error = { status: 400, message: err.message };
			next(error);
		}
	},
	validateUpdateUser: (req, res, next) => {
		let user = req.body;

		let {
			firstName,
			lastName,
			isActive,
			emailAdress,
			password,
			phoneNumber,
			roles,
			street,
			city,
		} = user;
		try {
			assert.match(
				password,
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
				'Password must contain 8-15 characters which contains at least one lower- and uppercase letter, one special character and one digit'
			);
			assert(
				typeof emailAdress === 'string',
				'emailAdress cannot be null!'
			);
			assert.match(
				emailAdress,
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Invalid emailadres'
			);
			assert(typeof firstName === 'string', 'First Name cannot be null!');
			assert(typeof lastName === 'string', 'Last Name cannot be null!');
			assert(typeof isActive === 'number', 'isActive cannot be null!');
			assert(
				typeof phoneNumber === 'string',
				'Phonenumber cannot be null!'
			);
			assert.match(
				phoneNumber,
				/^\d{10}$/,
				'Phonenumber should be 10 digits'
			);
			assert(typeof password === 'string', 'Password cannot be null!');
			assert(typeof roles === 'string', 'Roles cannot be null!');
			assert(typeof street === 'string', 'Street cannot be null!');
			assert(typeof city === 'string', 'City cannot be null!');
			next();
		} catch (err) {
			const error = { status: 400, message: err.message };
			next(error);
		}
	},
	addUser: (req, res) => {
		dbconnection.getConnection(function (err, connection) {
			let user = req.body;
			if (err) throw err;
			connection.query(
				'INSERT INTO user (firstName, lastName, street, city, emailAdress, password) VALUES(?, ?, ?, ?, ?, ?);',
				[
					user.firstName,
					user.lastName,
					user.street,
					user.city,
					user.emailAdress,
					user.password,
				],
				function (error, result, fields) {
					if (error) {
						connection.release();
						res.status(409).json({
							status: 409,
							message: `The email-address: ${user.emailAdress} has already been taken!`,
						});
					} else {
						connection.release();
						res.status(201).json({
							status: 201,
							result: `User ${user.firstName} has been succesfully registered`,
						});
					}
				}
			);
		});
	},
	getUserFromId: (req, res, next) => {
		const userId = req.params.userId;
		dbconnection.getConnection(function (err, connection) {
			if (err) throw error; //not connected

			//Use the connection
			connection.query(
				'SELECT * FROM user WHERE id = ' + userId + '',
				function (error, result, fields) {
					// When done with the connection, release it.
					connection.release();

					// Handle error afther the release.
					if (error) throw error;

					// Don't use the connection here, it has been returned to the pool.
					console.log('result = ', result.length);
					if (result.length < 1) {
						const error = {
							status: 404,
							message: `User with ID ${userId} not found`,
						};
						next(error);
						return;
					}
					res.status(200).json({
						status: 200,
						message: result,
					});
				}
			);
		});
	},
	getAllUsers: (req, res, next) => {
		dbconnection.getConnection(function (err, connection) {
			if (err) throw error; //not connected

			//Use the connection
			connection.query(
				'SELECT * from user',
				function (error, result, fields) {
					// When done with the connection, release it.
					connection.release();

					// Handle error afther the release.
					if (error) throw error;

					// Don't use the connection here, it has been returned to the pool.
					console.log('result = ', result.length);
					res.status(200).json({
						status: 200,
						result: result,
					});
				}
			);
		});
	},
	getUserProfileFromId: (req, res) => {
		res.status(401).json({
			status: 401,
			result: `Function is not yet implemented!`,
		});
	},
	updateUserFromId: (req, res) => {
		const userId = req.params.userId;
		const updateUser = req.body;
		console.log(`User with ID ${userId} requested to be updated`);
		dbconnection.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				'UPDATE user SET firstName=?, lastName=?, isActive=?, emailAdress=?, password=?, phoneNumber=?, street=?, city=? WHERE id = ?;',
				[
					updateUser.firstName,
					updateUser.lastName,
					updateUser.isActive,
					updateUser.emailAdress,
					updateUser.password,
					updateUser.phoneNumber,
					updateUser.street,
					updateUser.city,
					userId,
				],
				function (error, result, fields) {
					if (error) {
						res.status(401).json({
							status: 401,
							result: `Email ${user.emailAdress} has already been taken!`,
						});
						return;
					}
					if (result.affectedRows > 0) {
						connection.query(
							'SELECT * FROM user WHERE id = ?;',
							[userId],
							function (error, result, fields) {
								res.status(200).json({
									status: 200,
									result: result[0],
								});
							}
						);
					} else {
						res.status(400).json({
							status: 400,
							result: `Update failed, user with ID ${userId} does not exist`,
						});
					}
				}
			);
			connection.release();
		});
	},
	deleteUserFromId: (req, res) => {
		dbconnection.getConnection(function (err, connection) {
			const userId = req.params.userId;
			if (err) throw error; //not connected

			//Use the connection
			connection.query(
				'DELETE IGNORE FROM user WHERE Id = ' + userId,
				function (error, result, fields) {
					// When done with the connection, release it.
					connection.release();

					// Handle error afther the release.
					if (error) throw error;

					// Don't use the connection here, it has been returned to the pool.
					console.log('result = ', result.length);
					if (result.affectedRows > 0) {
						res.status(200).json({
							status: 200,
							result: `User with ID ${userId} deleted successfuly!`,
						});
					} else {
						res.status(400).json({
							status: 400,
							result: `User was not found!`,
						});
					}
				}
			);
		});
	},
};

module.exports = controller;
