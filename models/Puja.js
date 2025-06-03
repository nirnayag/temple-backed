const mongoose = require('mongoose');

const pujaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['regular', 'special', 'lifeEvents', 'festival'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  deity: {
    type: String,
    trim: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const pujaBookingSchema = new mongoose.Schema({
  pujaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puja',
    required: true
  },
  devoteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devotee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    enum: ['temple', 'residence'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  instructions: {
    type: String,
    trim: true
  },
  priest: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'credit_card', 'online'],
    default: 'cash'
  }
}, {
  timestamps: true
});

const Puja = mongoose.model('Puja', pujaSchema);
const PujaBooking = mongoose.model('PujaBooking', pujaBookingSchema);

module.exports = { Puja, PujaBooking }; 