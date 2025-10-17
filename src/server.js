require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const foodRoutes = require('./routes/foods');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cook Next Door API', status: 'running' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Connect to MongoDB (with fallback for local development)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cooknextdoor';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      startServer();
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Starting server without MongoDB connection...');
      startServer();
    });
} else {
  console.log('No MongoDB URI provided - starting server in development mode');
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.MONGODB_URI) {
      console.log('Note: Server is running without database connection');
    }
  });
}
