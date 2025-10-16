const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Food = require('../models/Food');

// POST /api/orders - Place an order
router.post('/', async (req, res) => {
  try {
    const { foodId, buyerName, address, deliveryOption } = req.body;

    // Validate delivery option
    if (!['walk', 'home'].includes(deliveryOption)) {
      return res.status(400).json({ message: 'Invalid delivery option' });
    }

    // Check if food exists and has available quantity
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (food.quantity <= 0) {
      return res.status(400).json({ message: 'Item out of stock' });
    }

    // Create order
    const newOrder = new Order({
      foodId,
      buyerName,
      address,
      deliveryOption,
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Decrement food quantity
    food.quantity -= 1;
    await food.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/payments - Handle payment (mock)
router.post('/payments', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find and update order payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'completed';
    await order.save();

    res.json({ message: 'Payment successful', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
