const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/authentication.controller');

router.get('/', (req, res) => {
	res.status(200).json({
		status: 200,
		result: 'Welcome to Share-a-meal API',
	});
});

router.post('/api/meal', mealController.registerMeal);

router.get('/api/meal', mealController.getAllMeals);

router.get('/api/meal/:mealId', mealController.getMealById);

router.put('/api/meal/:mealId', mealController.updateMealById);

router.delete('/api/meal/:mealId', mealController.deleteMealById);

module.exports = router;
