const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  prepTime: Number,
  diet: String,
  cuisine: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
