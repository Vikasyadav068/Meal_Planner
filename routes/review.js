const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Add review
router.post('/', async (req, res) => {
  const review = await Review.create(req.body);
  res.json(review);
});

// Get reviews for a recipe
router.get('/recipe/:id', async (req, res) => {
  const reviews = await Review.find({ recipe: req.params.id }).populate('user');
  res.json(reviews);
});

module.exports = router;
