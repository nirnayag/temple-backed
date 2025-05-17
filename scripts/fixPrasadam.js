const mongoose = require('mongoose');
const { Prasadam, PrasadamInfo } = require('../models/Prasadam');
require('dotenv').config();

// Prasadam general information
const prasadamInfo = {
  description: 'The temple makes prasadam available to devotees on weekends and special holidays for a nominal donation. The prasadam counter is open 9:00 AM to 1:00 PM & 5:00 PM to 9:00 PM on Monday, Tuesday, Thursday & Friday; 9:00 AM to 9:00 PM on Weekends, and special days. Prasadam counter is closed on Wednesdays.'
};

// Sample Prasadam Information
const prasadamData = [
  {
    dayOfWeek: 'Monday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Pongal', description: 'Sweet rice dish made with jaggery', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '01:00 PM' },
      evening: { start: '05:00 PM', end: '09:00 PM' }
    },
    isAvailable: true
  },
  {
    dayOfWeek: 'Tuesday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Puliyogare', description: 'Tamarind rice', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '01:00 PM' },
      evening: { start: '05:00 PM', end: '09:00 PM' }
    },
    isAvailable: true
  },
  {
    dayOfWeek: 'Wednesday',
    isAvailable: false,
    notes: 'Prasadam counter is closed on Wednesdays',
    availabilityHours: {
      morning: { start: '00:00 AM', end: '00:00 AM' },
      evening: { start: '00:00 PM', end: '00:00 PM' }
    },
    items: []
  },
  {
    dayOfWeek: 'Thursday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Sweet Pongal', description: 'Sweet rice dish made with jaggery', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '01:00 PM' },
      evening: { start: '05:00 PM', end: '09:00 PM' }
    },
    isAvailable: true
  },
  {
    dayOfWeek: 'Friday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Coconut Rice', description: 'Rice flavored with coconut', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '01:00 PM' },
      evening: { start: '05:00 PM', end: '09:00 PM' }
    },
    isAvailable: true
  },
  {
    dayOfWeek: 'Saturday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Sweet Pongal', description: 'Sweet rice dish made with jaggery', specialItem: true },
      { name: 'Puliyogare', description: 'Tamarind rice', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '09:00 PM' }
    },
    isAvailable: true
  },
  {
    dayOfWeek: 'Sunday',
    items: [
      { name: 'Vada', description: 'Savory fried snack made from lentils', specialItem: false },
      { name: 'Sweet Pongal', description: 'Sweet rice dish made with jaggery', specialItem: true },
      { name: 'Puliyogare', description: 'Tamarind rice', specialItem: true },
      { name: 'Curd Rice', description: 'Rice mixed with yogurt and seasoned with spices', specialItem: true }
    ],
    availabilityHours: {
      morning: { start: '09:00 AM', end: '09:00 PM' }
    },
    isAvailable: true
  }
];

// Fix the prasadam data
async function fixPrasadamData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing prasadam data...');
    await Prasadam.deleteMany({});
    await PrasadamInfo.deleteMany({});
    
    // Add prasadam info
    console.log('Creating prasadam info...');
    await PrasadamInfo.create(prasadamInfo);
    
    // Add prasadam data
    console.log('Creating prasadam data...');
    await Prasadam.insertMany(prasadamData);
    
    console.log('Prasadam data has been fixed successfully');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing prasadam data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the function
fixPrasadamData(); 