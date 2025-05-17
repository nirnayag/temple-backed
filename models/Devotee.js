const mongoose = require('mongoose');

const devoteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: 'USA',
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'other'],
    default: 'single'
  },
  familyMembers: [{
    name: String,
    relationship: String,
    dateOfBirth: Date
  }],
  gotra: {
    type: String,
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
  membershipExpiryDate: {
    type: Date
  },
  preferredDeity: {
    type: String,
    trim: true
  },
  preferredLanguage: {
    type: String,
    trim: true
  },
  volunteer: {
    type: Boolean,
    default: false
  },
  volunteerInterests: [{
    type: String,
    enum: ['events', 'puja', 'teaching', 'cooking', 'maintenance', 'administration', 'other']
  }],
  profileImage: {
    type: String,
    trim: true
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
  specialRequests: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Devotee = mongoose.model('Devotee', devoteeSchema);

module.exports = Devotee; 