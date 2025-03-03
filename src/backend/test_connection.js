const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  try {
    const mongodbURI = process.env.MONGODB_URI;
    await mongoose.connect(mongodbURI);
    console.log('Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    console.log('Connection closed');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testConnection();