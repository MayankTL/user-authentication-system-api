const mongoose = require('mongoose');

// Create a reusable function to connect to MongoDB using Mongoose.
const connectDB = async () => {
  try {
    // Read the connection string from environment variables.
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB Atlas or local MongoDB instance.
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process if the database connection fails.
  }
};

module.exports = connectDB;
