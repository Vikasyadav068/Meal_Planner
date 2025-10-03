const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  week: String, // e.g. '2025-09-29'
  days: [{
    day: String, // e.g. 'Monday'
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
  }]
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
