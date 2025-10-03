const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Admin: add recipe
router.post('/', async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.json(recipe);
});

// Admin: edit recipe
router.put('/:id', async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(recipe);
});

// Admin: delete recipe
router.delete('/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Admin: categorize recipe
router.put('/:id/categorize', async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { cuisine: req.body.cuisine }, { new: true });
  res.json(recipe);
});

module.exports = router;
