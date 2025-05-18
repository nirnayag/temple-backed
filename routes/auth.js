const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Devotee = require('../models/Devotee');

// Environment variable for JWT secret (fallback to a default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'temple_management_secret_key';

// Redirect to OTP-based authentication
router.post('/register', (req, res) => {
  return res.status(308).json({
    message: 'Traditional registration is no longer supported. Please use mobile OTP authentication.',
    redirectTo: '/api/otp-auth/request-otp'
  });
});

// Redirect to OTP-based authentication
router.post('/login', (req, res) => {
  return res.status(308).json({
    message: 'Traditional login is no longer supported. Please use mobile OTP authentication.',
    redirectTo: '/api/otp-auth/request-otp'
  });
});

// Admin registration with OTP verification
router.post('/register/admin', async (req, res) => {
  try {
    const { mobileNumber, name, email, username, address } = req.body;
    
    // Check if admin secret key is provided and correct
    const adminSecretKey = req.headers['admin-secret-key'];
    if (!adminSecretKey || adminSecretKey !== 'temple_admin_secret') {
      return res.status(403).json({ message: 'Not authorized to create admin account' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this mobile number' 
      });
    }
    
    // Create a devotee record for the admin
    const devotee = new Devotee({
      name,
      email,
      mobileNumber,
      address,
      membershipType: 'vip' // Admins are VIPs by default
    });
    
    const savedDevotee = await devotee.save();
    
    // Create admin user
    const user = new User({
      username,
      email,
      mobileNumber,
      devoteeId: savedDevotee._id,
      role: 'admin'
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's devotee profile
    const devotee = await Devotee.findById(user.devoteeId);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      devotee: devotee || null
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 