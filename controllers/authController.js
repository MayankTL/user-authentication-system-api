const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Helper function to generate a JWT token for a logged-in user.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Controller to register a new user.
const registerUser = async (req, res) => {
  try {
    // Validate the incoming request data.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if the user already exists by email.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash the password before saving it to the database.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document in MongoDB.
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('registerUser error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to log in an existing user.
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password.
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated user.
    const token = generateToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error('loginUser error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to return the profile of the authenticated user.
const getProfile = async (req, res) => {
  try {
    // req.user is attached by authMiddleware after verifying the JWT.
    const user = req.user;

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('getProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
