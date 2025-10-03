const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all recipes with filtering
router.get('/', async (req, res) => {
  const { diet, cuisine, prepTime, search } = req.query;
  let filter = {};
  
  if (diet) filter.diet = diet;
  if (cuisine) filter.cuisine = cuisine;
  if (prepTime) filter.prepTime = { $lte: parseInt(prepTime) };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ingredients: { $regex: search, $options: 'i' } }
    ];
  }
  
  const recipes = await Recipe.find(filter).populate('author', 'name');
  res.json(recipes);
});

// Get single recipe
router.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('author', 'name');
  res.json(recipe);
});

// Create recipe (protected)
router.post('/', auth, async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      author: req.user._id
    });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update recipe (protected)
router.put('/:id', auth, async (req, res) => {
  const recipe = await Recipe.findOneAndUpdate(
    { _id: req.params.id, author: req.user._id },
    req.body,
    { new: true }
  );
  res.json(recipe);
});

// Delete recipe (protected)
router.delete('/:id', auth, async (req, res) => {
  await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  res.json({ success: true });
});

module.exports = router;
