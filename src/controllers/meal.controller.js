const dbconnection = require('../../database/dbconnection');
const logger = require('../config/config').logger;
const assert = require('assert');
const { resourceUsage } = require('process');

let controller = {
	// UC-301
	registerMeal: (req, res, next) => {},
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
	updateMealById: (req, res, next) => {},
	// UC-305
	deleteMealById: (req, res, next) => {},
	// UC-306
	paricipateMeal: (req, res, next) => {},
};

module.exports = controller;
