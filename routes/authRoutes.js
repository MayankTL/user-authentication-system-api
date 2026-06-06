const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register route: validates the input and creates a new user.
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

// Login route: validates credentials and returns a JWT token.
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
);

// Profile route: protected route that returns the authenticated user's profile.
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
