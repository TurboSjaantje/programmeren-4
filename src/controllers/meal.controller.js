const dbconnection = require('../../database/dbconnection');
const logger = require('../config/config').logger;
const assert = require('assert');
const { resourceUsage } = require('process');
const { rollback } = require('../../database/dbconnection');

let controller = {
	// Validate new meal
	validateMeal: (req, res, next) => {
		let meal = req.body;
		let { name, description, imageUrl, maxAmountOfParticipants, price } =
			meal;

		try {
			assert(typeof name === 'string', 'Name should be a string!');
			assert(
				typeof description === 'string',
				'Description should be a string!'
			);
			assert(
				typeof imageUrl === 'string',
				'Image URL should be a string!'
			);
			assert(
				typeof maxAmountOfParticipants === 'number',
				'maxAmountofParticipants should be a number!'
			);
			assert(typeof price === 'number', 'Price should be a number!');

			next();
		} catch (err) {
			const error = { status: 400, message: err.message };
			next(error);
		}
	},
	// Validate updating meal
	validateMealUpdate: (req, res, next) => {
		let meal = req.body;
		let { name, maxAmountOfParticipants, price } = meal;

		try {
			assert(typeof name === 'string', 'Name should be a string');
			assert(
				typeof maxAmountOfParticipants === 'number',
				'maxAmountofParticipants should be a number'
			);
			assert(typeof price === 'number', 'Price should be a number');

			next();
		} catch (error) {
			const err = {
				status: 400,
				message: error.message,
			};
			next(err);
		}
	},
	// UC-301
	registerMeal: (req, res, next) => {
		let meal = req.body;
		let cookId = req.userId;
		logger.debug(meal);
		dbconnection.getConnection(function (err, connection) {
			if (err) throw err; // not connected!

			// adds new meal
			connection.query(
				'INSERT INTO meal (datetime, maxAmountOfParticipants, price, imageUrl, cookId, name, description, isActive, isVega, isVegan, isToTakeHome) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
				[
					meal.dateTime,
					meal.maxAmountOfParticipants,
					meal.price,
					meal.imageUrl,
					cookId,
					meal.name,
					meal.description,
					meal.isActive,
					meal.isVega,
					meal.isVegan,
					meal.isToTakeHome,
				],
				function (error, results, fields) {
					if (error) {
						logger.debug(error);
						connection.release();
						const newError = {
							status: 409,
							message: `Meal not created.`,
						};
						next(newError);
					} else {
						connection.query(
							'SELECT * FROM meal ORDER BY id DESC LIMIT 1;',
							function (error, results, fields) {
								if (error) throw error;

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
	// UC-302
	getAllMeals: (req, res, next) => {
		dbconnection.getConnection(function (error, connection) {
			if (error) throw error;
			connection.query(
				'SELECT * FROM meal',
				function (error, result, fields) {
					connection.release();
					if (error) throw error;
					logger.debug('result= ', result.length);
					res.status(200).json({
						status: 200,
						result: result,
					});
				}
			);
		});
	},
	// UC-303
	getMealById: (req, res, next) => {
		const mealId = req.params.mealId;
		dbconnection.getConnection(function (error, connection) {
			if (error) throw error;
			connection.query(
				'SELECT * FROM meal WHERE id = ?',
				[mealId],
				function (error, result, fields) {
					connection.release();
					if (error) throw error;

					logger.debug('result = ', result.length);
					if (result.length < 1) {
						const error = {
							status: 404,
							message: `Meal with id: ${mealId} not found!`,
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
	// UC-304
	updateMealById: (req, res, next) => {
		const mealId = req.params.mealId;
		const newMealInfo = req.body;

		dbconnection.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				'UPDATE meal SET name = ?, description = ?, isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, datetime = ?, imageUrl = ?, allergenes = ?, maxAmountOfParticipants = ?, price = ? WHERE id = ?;',
				[
					newMealInfo.name,
					newMealInfo.description,
					newMealInfo.isActive,
					newMealInfo.isVega,
					newMealInfo.isVegan,
					newMealInfo.isToTakeHome,
					newMealInfo.datetime,
					newMealInfo.imageUrl,
					newMealInfo.allergenes,
					newMealInfo.maxAmountOfParticipants,
					newMealInfo.price,
					mealId,
				],
				function (error, results, fields) {
					if (error) {
						connection.release();
						const newError = {
							status: 401,
							message: `Meal with ID ${mealId} not found`,
						};
						next(newError);
					} else {
						if (results.affectedRows > 0) {
							if (err) throw err;
							connection.query(
								'SELECT * FROM meal WHERE id = ?;',
								[mealId],
								function (error, results, fields) {
									connection.release();
									if (error) throw error;
									res.status(201).json({
										status: 201,
										result: results[0],
									});
								}
							);
						} else {
							const error = {
								status: 401,
								message: `Meal with ID ${mealId} not found`,
							};
							next(error);
						}
					}
				}
			);
		});
	},
	// UC-305
	deleteMealById: (req, res, next) => {
		const mealId = req.params.mealId;
		const userId = req.userId;

		dbconnection.getConnection(function (error, connection) {
			// Get Meal before deleting
			connection.query(
				'SELECT * FROM meal WHERE id = ' + mealId,
				function (error, meal, fields) {
					if (error) throw error;
					if (meal.length < 1) {
						res.status(401).json({
							status: 401,
							message: 'Meal not found!',
						});
						logger.debug('Deleting meal was not found!');
						return;
					}

					// Delete meal
					connection.query(
						'DELETE IGNORE FROM meal WHERE id = ' + mealId,
						function (error, result, fields) {
							logger.debug('Meal deleted succesfully!');
							connection.release;
							res.status(201).json({
								status: 201,
								result: meal[0],
							});
						}
					);
				}
			);
		});
	},
};

module.exports = controller;

//test
