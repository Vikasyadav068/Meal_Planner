const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  rating: Number,
  comment: String,
  photo: String // URL or base64
});

module.exports = mongoose.model('Review', ReviewSchema);
