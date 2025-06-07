const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Force port to 4000 to match frontend configuration
const PORT = 4000;

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

// Use routes
app.use('/api/devotees', devoteeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/otp-auth', otpAuthRoutes);
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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple')
  .then(() => console.log('MongoDB Connected to temple database'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
}); 