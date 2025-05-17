const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Environment variable for JWT secret (fallback to a default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'temple_management_secret_key';

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin role check middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// User role check middleware (allows both users and admins)
exports.userOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'user' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Access denied. User privileges required.' });
  }
  next();
}; 