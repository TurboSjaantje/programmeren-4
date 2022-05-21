const dbconnection = require('../../database/dbconnection');
const logger = require('../config/config').logger;
const assert = require('assert');

let controller = {
	// Validate New User
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
			assert.match(
				password,
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
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
	// Validate Update User
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
	// UC-201
	addUser: (req, res) => {
		let user = req.body;
		dbconnection.getConnection(function (error, connection) {
			if (error) throw error;
			connection.query(
				'INSERT INTO user (firstName, lastName, street, city, phoneNumber, emailAdress, password) VALUES(?,?, ?, ?, ?, ?, ?);',
				[
					user.firstName,
					user.lastName,
					user.street,
					user.city,
					user.phoneNumber,
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
						connection.query(
							`SELECT * FROM user WHERE emailAdress = ?`,
							[user.emailAdress],
							function (error, results, fields) {
								connection.release();
								res.status(201).json({
									status: 201,
									result: results[0],
								});
							}
						);
					}
				}
			);
		});
	},
	// UC-202
	getAllUsers: (req, res, next) => {
		// Get params
		let query = req.query;
		let { active, name } = query;

		if (active == 'false') active = 0;
		else if (active == 'true') active = 1;

		// Define query
		let dbQuery = 'SELECT * FROM user';
		if (active != undefined && name != undefined)
			dbQuery = `SELECT * FROM user WHERE isActive = ${active} AND firstname LIKE '%${name}%'`;
		else if (active != undefined && active != 0 && active != 1)
			res.status(401).json({
				status: 401,
				message: 'Invalid search term!',
			});
		else if (active != undefined && name == undefined)
			dbQuery = `SELECT * FROM user WHERE isActive = ${active}`;
		else if (active == undefined && name != undefined)
			dbQuery = `SELECT * FROM user WHERE firstname LIKE '%${name}%'`;

		// Retrieve users
		dbconnection.getConnection(function (err, connection) {
			if (err) throw error;
			connection.query(dbQuery, function (error, result, fields) {
				connection.release();
				if (error) throw error;
				logger.debug('result = ', result.length);
				res.status(200).json({
					status: 200,
					result: result,
				});
			});
		});
	},
	// UC-203
	getUserProfileFromId: (req, res, next) => {
		const userId = req.userId;
		dbconnection.getConnection(function (error, connection) {
			if (error) throw error;
			connection.query(
				'SELECT * FROM user WHERE id = ?',
				[userId],
				function (error, result, fields) {
					connection.release();
					if (error) throw error;

					logger.debug('result = ', result.length);
					if (result.length < 1) {
						const error = {
							status: 404,
							message: `User with id: ${userId} not found!`,
						};
						next(error);
						return;
					}
					res.status(200).json({
						status: 200,
						result: result[0],
					});
				}
			);
		});
	},
	// UC-204
	getUserFromId: (req, res, next) => {
		const userId = req.params.userId;
		dbconnection.getConnection(function (err, connection) {
			if (err) throw error;
			connection.query(
				'SELECT * FROM user WHERE id = ' + userId + '',
				function (error, result, fields) {
					connection.release();
					if (error) throw error;
					logger.debug('result = ', result.length);
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
						result: result[0],
					});
				}
			);
		});
	},
	// UC-205
	updateUserFromId: (req, res) => {
		const userId = req.params.userId;
		const updateUser = req.body;
		logger.debug(`User with ID ${userId} requested to be updated`);
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
	// UC-206
	deleteUserFromId: (req, res) => {
		const userId = req.params.userId;
		dbconnection.getConnection(function (err, connection) {
			if (err) throw error;
			connection.query(
				'DELETE IGNORE FROM user WHERE Id = ' + userId,
				function (error, result, fields) {
					connection.release();
					if (error) throw error;
					logger.debug('result = ', result.length);
					if (result.affectedRows > 0) {
						res.status(200).json({
							status: 200,
							message: `User with ID ${userId} deleted successfuly!`,
						});
					} else {
						res.status(400).json({
							status: 400,
							message: `User does not exist`,
						});
					}
				}
			);
		});
	},
};

module.exports = controller;
