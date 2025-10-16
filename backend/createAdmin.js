require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = new Admin({
      username: 'admin',
      email: 'admin@cooknextdoor.com',
      password: 'Pass@123'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: Pass@123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
