const dbconnection = require('../../database/dbconnection');
const logger = require('../config/config').logger;
const assert = require('assert');
const { resourceUsage } = require('process');
const { rollback } = require('../../database/dbconnection');

let controller = {
	validateMeal: (req, res, next) => {
		let meal = req.body;
		let { name, description, imageUrl, maxAmountOfParticipants, price } =
			meal;

		// validates meal attributes
		try {
			assert(typeof name === 'string', 'Name should be a string');
			assert(
				typeof description === 'string',
				'Description should be a string'
			);
			assert(
				typeof imageUrl === 'string',
				'Image URL should be a string'
			);
			assert(
				typeof maxAmountOfParticipants === 'number',
				'maxAmountofParticipants should be a number'
			);
			assert(typeof price === 'number', 'Price should be a number');

			next();
		} catch (err) {
			const error = {
				status: 400,
				message: err.message,
			};

			next(error);
		}
	},
	validateMealUpdate: (req, res, next) => {
		let meal = req.body;
		let { name, description, imageUrl, maxAmountOfParticipants, price } =
			meal;

		// validates meal attributes
		try {
			assert(typeof name === 'string', 'Name should be a string');
			assert(
				typeof description === 'string',
				'Description should be a string'
			);
			assert(
				typeof imageUrl === 'string',
				'Image URL should be a string'
			);
			assert(
				typeof maxAmountOfParticipants === 'number',
				'maxAmountofParticipants should be a number'
			);
			assert(typeof price === 'number', 'Price should be a number');

			next();
		} catch (err) {
			const error = {
				status: 400,
				message: err.message,
			};

			next(error);
		}
	},
	// UC-301
	registerMeal: (req, res, next) => {
		let meal = req.body;
		const cookId = req.userId;
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
								connection.query(
									'SELECT * FROM user WHERE id = ' + cookId,
									function (error, resultss, fields) {
										connection.release();
										if (error) throw error;
										let response = [
											{ ...results[0] },
											{ ...resultss[0] },
										];
										res.status(201).json({
											status: 201,
											result: response,
										});
									}
								);
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
						result: result,
					});
				}
			);
		});
	},
	// UC-304
	updateMealById: (req, res, next) => {
		const meal = req.body;
		const mealId = req.params.mealId;
		const userId = req.userId;

		logger.debug(`meal with ID ${mealId} requested to be updated`);

		dbconnection.getConnection(function (error, connection) {
			if (error) throw error;
			connection.query(
				'UPDATE meal SET name = ?, description = ?, isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, maxAmountOfParticipants = ?, price = ?, imageUrl = ? WHERE id =?;',
				[
					meal.name,
					meal.description,
					meal.isActive,
					meal.isVega,
					meal.isVegan,
					meal.isToTakeHome,
					meal.dateTime,
					meal.maxAmountOfParticipants,
					meal.price,
					meal.imageUrl,
					mealId,
				],
				function (error, result, fields) {
					if (result.affectedRows < 1) {
						res.status(401).json({
							status: 401,
							message: `Meal with ID ${mealId} not found`,
						});
						next(error);
						return;
					}
					if (result.affectedRows > 0) {
						logger.debug(
							`meal with ID ${mealId} succesfully updated`
						);
						// Get updated meal
						connection.query(
							'SELECT * FROM meal WHERE id = ' + mealId,
							function (error, meal, fields) {
								if (error) throw error;

								// Get user from updated meal
								connection.query(
									'SELECT * FROM user WHERE id = ?',
									[userId],
									function (error, user, fields) {
										connection.release();
										if (error) throw error;

										let response = [
											{ ...meal[0] },
											{ ...user[0] },
										];

										res.status(201).json({
											status: 201,
											result: response,
										});
									}
								);
							}
						);
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
					// Get owner of meal before deleting
					connection.query(
						'SELECT * FROM user WHERE id = ' + userId,
						function (error, cook, fields) {
							if (error) throw error;
							// Delete meal
							connection.query(
								'DELETE IGNORE FROM meal WHERE id = ' + mealId,
								function (error, result, fields) {
									logger.debug('Meal deleted succesfully!');
									let response = [...meal, ...cook];
									connection.release;
									res.status(201).json({
										status: 201,
										result: response,
									});
								}
							);
						}
					);
				}
			);
		});
	},
};

module.exports = controller;
