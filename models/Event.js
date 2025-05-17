const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['puja', 'festival', 'discourse', 'community', 'class', 'cultural', 'other'],
    default: 'puja'
  },
  priest: {
    type: String,
    trim: true
  },
  deity: {
    type: String,
    trim: true
  },
  celebrationDetails: {
    type: String,
    trim: true
  },
  sponsorshipAvailable: {
    type: Boolean,
    default: false
  },
  sponsorshipAmount: {
    type: Number,
    default: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  maxAttendees: {
    type: Number
  },
  imageUrl: {
    type: String,
    trim: true
  },
  registeredDevotees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devotee'
  }],
  sponsors: [{
    devoteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Devotee'
    },
    amount: {
      type: Number
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  recurringEvent: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom', null],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 