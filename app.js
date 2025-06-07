const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import routes
const devoteeRoutes = require('./routes/devotees');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const otpAuthRoutes = require('./routes/otp-auth');
const announcementRoutes = require('./routes/announcements');
const prasadamRoutes = require('./routes/prasadam');
const templeRoutes = require('./routes/temple');
const paymentRoutes = require('./routes/payment');
const pujaRoutes = require('./routes/pujas');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Temple Management API is running');
});

// Status endpoint for troubleshooting
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp-auth', otpAuthRoutes);
app.use('/api/devotees', devoteeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/prasadam', prasadamRoutes);
app.use('/api/temple', templeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pujas', pujaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 