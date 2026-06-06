const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before the application starts handling requests.
connectDB();

// Parse incoming JSON requests and make the data available on req.body.
app.use(express.json());

// Allow requests from the browser, Postman, or mobile clients.
app.use(cors());

// Register all authentication-related routes.
app.use('/', authRoutes);

// Basic health check route to confirm the server is running.
app.get('/', (req, res) => {
  res.json({ success: true, message: 'User Authentication API is running' });
});

// Global error handler for unexpected server errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
