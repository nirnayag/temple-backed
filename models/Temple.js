const mongoose = require('mongoose');

// Features schema for temple features/services
const featureSchema = new mongoose.Schema({
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
  icon: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Section schema for temple information sections
const sectionSchema = new mongoose.Schema({
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
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Main temple information schema
const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Sri Siva Vishnu Temple'
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
    default: 'Experience peace, spirituality and cultural richness'
  },
  bannerImage: {
    type: String,
    trim: true,
    default: '/images/temple-banner.jpg'
  },
  address: {
    street: {
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
      trim: true
    }
  },
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  hours: {
    monday: {
      type: String,
      trim: true
    },
    tuesday: {
      type: String,
      trim: true
    },
    wednesday: {
      type: String,
      trim: true
    },
    thursday: {
      type: String,
      trim: true
    },
    friday: {
      type: String,
      trim: true
    },
    saturday: {
      type: String,
      trim: true
    },
    sunday: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

const Temple = mongoose.model('Temple', templeSchema);
const Feature = mongoose.model('Feature', featureSchema);
const Section = mongoose.model('Section', sectionSchema);

module.exports = { Temple, Feature, Section }; 