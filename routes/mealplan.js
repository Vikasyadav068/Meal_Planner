const express = require('express');
const MealPlan = require('../models/MealPlan');
const router = express.Router();

// Create or update meal plan
router.post('/', async (req, res) => {
  const { user, week, days } = req.body;
  let plan = await MealPlan.findOne({ user, week });
  if (plan) {
    plan.days = days;
    await plan.save();
    return res.json(plan);
  }
  plan = await MealPlan.create({ user, week, days });
  res.json(plan);
});

// Get meal plan for user/week
router.get('/:user/:week', async (req, res) => {
  const plan = await MealPlan.findOne({ user: req.params.user, week: req.params.week }).populate('days.meals');
  res.json(plan);
});

module.exports = router;
