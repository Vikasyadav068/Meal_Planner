const express = require('express');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Generate shopping list from meal plan
router.get('/:user/:week', async (req, res) => {
  const plan = await MealPlan.findOne({ user: req.params.user, week: req.params.week }).populate('days.meals');
  if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
  let ingredients = [];
  plan.days.forEach(day => {
    day.meals.forEach(recipe => {
      ingredients = ingredients.concat(recipe.ingredients);
    });
  });
  // Categorize ingredients (simple grouping by first letter)
  const categorized = {};
  ingredients.forEach(item => {
    const cat = item[0].toUpperCase();
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(item);
  });
  res.json({ shoppingList: categorized });
});

module.exports = router;
