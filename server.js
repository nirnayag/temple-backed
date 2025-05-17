const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const devoteeRoutes = require('./routes/devotees');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Temple Management API is running');
});

// Use routes
app.use('/api/devotees', devoteeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple')
  .then(() => console.log('MongoDB Connected to temple database'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 