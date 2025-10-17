const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Food = require('../models/Food');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.updateLastLogin();

    // Create token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (protected)
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('foodId', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (protected)
router.put('/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    ).populate('foodId', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics (protected)
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalFoods = await Food.countDocuments();
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });

    // Calculate total revenue
    const completedOrderDocs = await Order.find({ paymentStatus: 'completed' }).populate('foodId', 'price');
    const totalRevenue = completedOrderDocs.reduce((sum, order) => {
      return sum + (order.foodId ? order.foodId.price : 0);
    }, 0);

    res.json({
      totalOrders,
      totalFoods,
      pendingOrders,
      completedOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all foods for management (protected)
router.get('/foods', authMiddleware, async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new food (protected)
router.post('/foods', authMiddleware, async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update food (protected)
router.put('/foods/:id', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete food (protected)
router.delete('/foods/:id', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer data (all orders with buyer info)
router.get('/customers', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('foodId', 'name price')
      .sort({ createdAt: -1 });

    // Group by buyer name
    const customerStats = {};
    orders.forEach(order => {
      const buyerName = order.buyerName;
      if (!customerStats[buyerName]) {
        customerStats[buyerName] = {
          name: buyerName,
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: order.createdAt,
          orders: []
        };
      }
      customerStats[buyerName].totalOrders++;
      if (order.foodId) {
        customerStats[buyerName].totalSpent += order.foodId.price;
      }
      customerStats[buyerName].orders.push(order);
    });

    res.json(Object.values(customerStats));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
