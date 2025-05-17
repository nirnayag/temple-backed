const mongoose = require('mongoose');

// Schema for prasadam general information
const prasadamInfoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    default: 'The temple makes prasadam available to devotees on weekends and special holidays for a nominal donation. The prasadam counter is open 9:00 AM to 1:00 PM & 5:00 PM to 9:00 PM on Monday, Tuesday, Thursday & Friday; 9:00 AM to 9:00 PM on Weekends, and special days. Prasadam counter is closed on Wednesdays.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const prasadamSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    specialItem: {
      type: Boolean,
      default: false
    }
  }],
  availabilityHours: {
    morning: {
      start: {
        type: String,
        default: '09:00 AM'
      },
      end: {
        type: String,
        default: '01:00 PM'
      }
    },
    evening: {
      start: {
        type: String,
        default: '05:00 PM'
      },
      end: {
        type: String,
        default: '09:00 PM'
      }
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Prasadam = mongoose.model('Prasadam', prasadamSchema);
const PrasadamInfo = mongoose.model('PrasadamInfo', prasadamInfoSchema);

module.exports = { Prasadam, PrasadamInfo }; 