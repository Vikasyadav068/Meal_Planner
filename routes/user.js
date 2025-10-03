const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const { name, diet, allergies, cuisines } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, diet, allergies, cuisines },
    { new: true }
  );
  res.json(user);
});

// Save recipe to favorites
router.post('/favorites/:recipeId', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.favorites.includes(req.params.recipeId)) {
    user.favorites.push(req.params.recipeId);
    await user.save();
  }
  res.json({ message: 'Recipe saved to favorites' });
});

// Get user's favorite recipes
router.get('/favorites', auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user.favorites);
});

module.exports = router;
