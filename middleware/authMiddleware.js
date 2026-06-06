const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify the JWT token.
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and starts with Bearer.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    // Extract the token from the header.
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    // Verify the token using the JWT secret.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the authenticated user's ID to the request object.
    req.userId = decoded.id;

    // Optionally, load the user data from the database for future handlers.
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = authMiddleware;
