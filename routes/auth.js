const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Devotee = require('../models/Devotee');

// Environment variable for JWT secret (fallback to a default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'temple_management_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      name, 
      phone, 
      address, 
      city, 
      state, 
      country 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Create a devotee record for the user
    const devotee = new Devotee({
      name: name || 'Temple Devotee',
      email,
      phone,
      address,
      city,
      state,
      country,
      membershipType: 'regular'
    });
    
    const savedDevotee = await devotee.save();
    
    // Create user with reference to devotee
    const user = new User({
      username,
      email,
      password,
      devoteeId: savedDevotee._id,
      role: 'user' // Default role is user
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin registration (separate endpoint with admin role)
router.post('/register/admin', async (req, res) => {
  try {
    const { username, email, password, name, phone, address } = req.body;
    
    // Check if admin secret key is provided and correct
    const adminSecretKey = req.headers['admin-secret-key'];
    if (!adminSecretKey || adminSecretKey !== 'temple_admin_secret') {
      return res.status(403).json({ message: 'Not authorized to create admin account' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Create a devotee record for the admin
    const devotee = new Devotee({
      name,
      email,
      phone,
      address,
      membershipType: 'vip' // Admins are VIPs by default
    });
    
    const savedDevotee = await devotee.save();
    
    // Create admin user
    const user = new User({
      username,
      email,
      password,
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
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled. Please contact admin.' });
    }
    
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
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
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's devotee profile
    const devotee = await Devotee.findById(user.devoteeId);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
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