const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET /api/foods - Fetch all available foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/foods/:id - Fetch single food item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/foods - Add new food item
router.post('/', async (req, res) => {
  try {
    const { name, price, quantity, preorder, imageUrl } = req.body;

    const newFood = new Food({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl,
      preorder: preorder === 'true'
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
