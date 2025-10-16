const mongoose = require('mongoose');
const Food = require('./models/Food');
const Order = require('./models/Order');
const Admin = require('./models/Admin');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    addSampleOrders();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Sample customers
const sampleCustomers = [
  {
    name: 'Rahul Sharma',
    address: '123 MG Road, Bangalore',
    phone: '+91-9876543210'
  },
  {
    name: 'Priya Patel',
    address: '456 Gandhi Nagar, Mumbai',
    phone: '+91-9876543211'
  },
  {
    name: 'Amit Kumar',
    address: '789 Karol Bagh, Delhi',
    phone: '+91-9876543212'
  },
  {
    name: 'Sneha Reddy',
    address: '321 Banjara Hills, Hyderabad',
    phone: '+91-9876543213'
  },
  {
    name: 'Vijay Singh',
    address: '654 Civil Lines, Jaipur',
    phone: '+91-9876543214'
  },
  {
    name: 'Kavita Brown',
    address: '987 Park Street, Kolkata',
    phone: '+91-9876543215'
  },
  {
    name: 'Arun Nair',
    address: '147 MG Road, Chennai',
    phone: '+91-9876543216'
  },
  {
    name: 'Meera Joshi',
    address: '258 FC Road, Pune',
    phone: '+91-9876543217'
  }
];

async function addSampleOrders() {
  try {
    // Get all foods first
    const foods = await Food.find({}).select('_id name price');
    if (foods.length === 0) {
      console.log('❌ No food items found. Please run add sample food data first');
      process.exit(1);
    }

    // Create sample orders
    const sampleOrders = [];

    // Create multiple orders for each customer
    for (let i = 0; i < sampleCustomers.length; i++) {
      const customer = sampleCustomers[i];

      // Create 1-3 orders per customer
      const orderCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < orderCount; j++) {
        // Select random food
        const randomFood = foods[Math.floor(Math.random() * foods.length)];

        // Random delivery option
        const deliveryOptions = ['walk', 'home'];
        const randomDelivery = deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)];

        // Random payment status
        const paymentStatuses = ['pending', 'completed', 'completed', 'completed']; // Bias towards completed
        const randomStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

        // Create order with some random time in the past week
        const randomDaysAgo = Math.floor(Math.random() * 7);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - randomDaysAgo);

        const order = {
          foodId: randomFood._id,
          buyerName: customer.name,
          address: customer.address,
          deliveryOption: randomDelivery,
          paymentStatus: randomStatus,
          createdAt: orderDate
        };

        sampleOrders.push(order);
      }
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Existing order data cleared');

    // Insert sample orders
    const insertedOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Successfully added ${insertedOrders.length} sample orders to MongoDB`);

    // Show summary
    const orderStats = insertedOrders.reduce((stats, order) => {
      stats.total++;
      stats[order.paymentStatus]++;
      return stats;
    }, { total: 0, pending: 0, completed: 0 });

    console.log('\n📊 Order Statistics:');
    console.log(`Total Orders: ${orderStats.total}`);
    console.log(`Pending Orders: ${orderStats.pending}`);
    console.log(`Completed Orders: ${orderStats.completed}`);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $lookup: { from: 'foods', localField: 'foodId', foreignField: '_id', as: 'food' } },
      { $unwind: '$food' },
      { $group: { _id: null, total: { $sum: '$food.price' } } }
    ]);

    if (totalRevenue.length > 0) {
      console.log(`💰 Total Revenue: ₹${totalRevenue[0].total}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample orders:', error);
    process.exit(1);
  }
}
