const mongoose = require('mongoose');

const devoteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  memberSince: {
    type: Date,
    default: Date.now
  },
  membershipType: {
    type: String,
    enum: ['regular', 'lifetime', 'vip', 'sponsor', 'trustee'],
    default: 'regular'
  },
  donationHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    purpose: String,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    receiptNumber: String,
    paymentMethod: {
      type: String,
      enum: ['cash', 'check', 'credit_card', 'online', 'other'],
      default: 'cash'
    },
    notes: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Devotee = mongoose.model('Devotee', devoteeSchema);

module.exports = Devotee; 