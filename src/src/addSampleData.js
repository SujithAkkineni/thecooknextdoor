const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    addSampleData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Sample food data
const sampleFoods = [
  {
    name: 'Homemade Biryani',
    price: 180,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
    distance: 2,
    preorder: true
  },
  {
    name: 'Authentic Dal Makhani',
    price: 120,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    distance: 1,
    preorder: false
  },
  {
    name: 'Paneer Butter Masala',
    price: 150,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    distance: 3,
    preorder: true
  },
  {
    name: 'Aloo Paratha (2 pieces)',
    price: 80,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1561310584-b1ec3633c5ca?w=400&h=300&fit=crop',
    distance: 2,
    preorder: false
  },
  {
    name: 'Fresh Vegetable Pulao',
    price: 100,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    distance: 1,
    preorder: false
  },
  {
    name: 'Chicken Curry',
    price: 200,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
    distance: 4,
    preorder: true
  },
  {
    name: 'Rajma Chawal',
    price: 130,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    distance: 2,
    preorder: false
  },
  {
    name: 'Momos (Chicken - 8 pieces)',
    price: 90,
    quantity: 7,
    imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',
    distance: 3,
    preorder: true
  }
];

async function addSampleData() {
  try {
    // Clear existing data
    await Food.deleteMany({});
    console.log('Existing food data cleared');

    // Insert sample data
    const insertedFoods = await Food.insertMany(sampleFoods);
    console.log(`✅ Successfully added ${insertedFoods.length} sample food items to MongoDB`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}
