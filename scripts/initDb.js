const mongoose = require('mongoose');
const Devotee = require('../models/Devotee');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

// Sample data for devotees
const devotees = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    dateOfBirth: new Date('1985-05-15'),
    maritalStatus: 'married',
    gotra: 'Kashyap',
    membershipType: 'lifetime',
    preferredDeity: 'Lord Ganesha',
    preferredLanguage: 'Hindi',
    volunteer: true,
    volunteerInterests: ['events', 'puja'],
    donationHistory: [
      {
        date: new Date('2023-01-10'),
        amount: 5100,
        purpose: 'Temple Renovation',
        paymentMethod: 'online',
        receiptNumber: 'DNT-2023-001'
      },
      {
        date: new Date('2023-05-22'),
        amount: 2100,
        purpose: 'Annual Festival',
        paymentMethod: 'credit_card',
        receiptNumber: 'DNT-2023-032'
      }
    ]
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '8765432109',
    address: '456 Park Avenue',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    dateOfBirth: new Date('1990-10-20'),
    maritalStatus: 'single',
    gotra: 'Vatsa',
    membershipType: 'regular',
    preferredDeity: 'Goddess Lakshmi',
    preferredLanguage: 'Gujarati',
    volunteer: false,
    donationHistory: [
      {
        date: new Date('2023-03-15'),
        amount: 1100,
        purpose: 'General Donation',
        paymentMethod: 'cash',
        receiptNumber: 'DNT-2023-021'
      }
    ]
  },
  {
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '7654321098',
    address: '789 Temple Road',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    dateOfBirth: new Date('1978-12-05'),
    maritalStatus: 'married',
    gotra: 'Bharadwaj',
    membershipType: 'vip',
    preferredDeity: 'Lord Shiva',
    preferredLanguage: 'Sanskrit',
    volunteer: true,
    volunteerInterests: ['teaching', 'administration'],
    familyMembers: [
      {
        name: 'Sunita Kumar',
        relationship: 'spouse',
        dateOfBirth: new Date('1982-08-12')
      },
      {
        name: 'Arjun Kumar',
        relationship: 'son',
        dateOfBirth: new Date('2010-05-20')
      }
    ],
    donationHistory: [
      {
        date: new Date('2023-02-01'),
        amount: 11000,
        purpose: 'Priest Fund',
        paymentMethod: 'check',
        receiptNumber: 'DNT-2023-011'
      },
      {
        date: new Date('2023-06-10'),
        amount: 15100,
        purpose: 'New Temple Construction',
        paymentMethod: 'online',
        receiptNumber: 'DNT-2023-045'
      }
    ]
  },
  {
    name: 'Lakshmi Venkatesh',
    email: 'lakshmi@example.com',
    phone: '9876123450',
    address: '234 Deities Lane',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    dateOfBirth: new Date('1975-11-11'),
    maritalStatus: 'married',
    gotra: 'Atri',
    membershipType: 'trustee',
    preferredDeity: 'Lord Venkateshwara',
    preferredLanguage: 'Tamil',
    volunteer: true,
    volunteerInterests: ['administration', 'events', 'puja'],
    familyMembers: [
      {
        name: 'Venkatesh Rao',
        relationship: 'spouse',
        dateOfBirth: new Date('1972-04-05')
      }
    ],
    donationHistory: [
      {
        date: new Date('2023-01-05'),
        amount: 51000,
        purpose: 'Temple Development Fund',
        paymentMethod: 'online',
        receiptNumber: 'DNT-2023-005'
      }
    ]
  }
];

// Sample data for events
const events = [
  {
    title: 'Diwali Celebration',
    description: 'Annual Diwali celebration with lamps, prayers, and community feast. Join us for a special puja, lighting ceremony, and cultural performances.',
    date: new Date('2023-11-12'),
    startTime: '18:00',
    endTime: '22:00',
    location: 'Main Temple Hall',
    eventType: 'festival',
    priest: 'Pandit Ramesh Joshi',
    deity: 'Goddess Lakshmi',
    celebrationDetails: 'Special Lakshmi Puja followed by lamp lighting ceremony and cultural performances',
    sponsorshipAvailable: true,
    sponsorshipAmount: 1100,
    registrationRequired: false,
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Diwali+Celebration'
  },
  {
    title: 'Weekly Bhajan',
    description: 'Weekly devotional singing session with community participation. Experience the divine through music and devotional songs.',
    date: new Date('2023-07-18'),
    startTime: '19:00',
    endTime: '20:30',
    location: 'Bhajan Hall',
    eventType: 'community',
    priest: 'Bhajan Leader Sita',
    registrationRequired: false,
    recurringEvent: true,
    recurringPattern: 'weekly',
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Weekly+Bhajan'
  },
  {
    title: 'Ganesh Chaturthi',
    description: 'Special puja for Lord Ganesha on Ganesh Chaturthi. Celebrate the birth of Lord Ganesha with special rituals and prasadam.',
    date: new Date('2023-09-19'),
    startTime: '09:00',
    endTime: '12:00',
    location: 'Main Temple',
    eventType: 'puja',
    priest: 'Pandit Ramesh Joshi',
    deity: 'Lord Ganesha',
    celebrationDetails: 'Ganesh Abhishekam, Archana, and distribution of Modak prasadam',
    sponsorshipAvailable: true,
    sponsorshipAmount: 2100,
    registrationRequired: false,
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Ganesh+Chaturthi'
  },
  {
    title: 'Spiritual Discourse',
    description: 'Spiritual discourse on Bhagavad Gita by renowned scholar. Learn about the timeless wisdom of the Bhagavad Gita and its application in modern life.',
    date: new Date('2023-08-05'),
    startTime: '17:00',
    endTime: '19:00',
    location: 'Lecture Hall',
    eventType: 'discourse',
    priest: 'Swami Krishnananda',
    registrationRequired: true,
    registrationFee: 0,
    maxAttendees: 100,
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Spiritual+Discourse'
  },
  {
    title: 'Navratri Celebrations',
    description: 'Nine nights of devotion to the Divine Mother with special pujas and cultural performances.',
    date: new Date('2023-10-15'),
    startTime: '18:00',
    endTime: '22:00',
    location: 'Temple Complex',
    eventType: 'festival',
    priest: 'Pandit Shiva Gurukkal',
    deity: 'Goddess Durga',
    celebrationDetails: 'Daily puja, Garba dance, cultural performances, and prasadam distribution',
    sponsorshipAvailable: true,
    sponsorshipAmount: 5100,
    registrationRequired: false,
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Navratri+Celebrations'
  },
  {
    title: 'Yoga & Meditation Class',
    description: 'Weekly yoga and meditation class for all ages and experience levels.',
    date: new Date('2023-07-20'),
    startTime: '08:00',
    endTime: '09:30',
    location: 'Yoga Hall',
    eventType: 'class',
    registrationRequired: true,
    registrationFee: 10,
    maxAttendees: 25,
    recurringEvent: true,
    recurringPattern: 'weekly',
    imageUrl: 'https://placehold.co/600x400/800020/FFFFFF?text=Yoga+and+Meditation'
  }
];

// Function to connect to MongoDB and initialize data
async function initializeDb() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    console.log('Connected to MongoDB temple database');

    // Clear existing data
    console.log('Clearing existing data...');
    await Devotee.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    // Insert sample devotees
    console.log('Inserting sample devotees...');
    const createdDevotees = await Devotee.insertMany(devotees);
    console.log(`${createdDevotees.length} devotees inserted`);

    // Create sample users (admin and regular user)
    console.log('Creating sample users...');
    
    // Admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@temple.com',
      password: 'admin123',  // This will be hashed by the pre-save hook
      role: 'admin',
      devoteeId: createdDevotees[0]._id
    });
    await adminUser.save();
    
    // Regular user
    const regularUser = new User({
      username: 'user',
      email: 'user@temple.com',
      password: 'user123',  // This will be hashed by the pre-save hook
      role: 'user',
      devoteeId: createdDevotees[1]._id
    });
    await regularUser.save();
    
    // Trustee user
    const trusteeUser = new User({
      username: 'trustee',
      email: 'trustee@temple.com',
      password: 'trustee123',  // This will be hashed by the pre-save hook
      role: 'admin', // Trustees are given admin access in the system
      devoteeId: createdDevotees[3]._id
    });
    await trusteeUser.save();
    
    console.log('Sample users created:');
    console.log('- Admin: username="admin", password="admin123"');
    console.log('- User: username="user", password="user123"');
    console.log('- Trustee: username="trustee", password="trustee123"');

    // Insert sample events
    console.log('Inserting sample events...');
    
    // Add some registered devotees to events
    events[0].registeredDevotees = [createdDevotees[0]._id, createdDevotees[1]._id];
    events[1].registeredDevotees = [createdDevotees[2]._id];
    events[2].registeredDevotees = [createdDevotees[0]._id, createdDevotees[1]._id, createdDevotees[2]._id];
    events[3].registeredDevotees = [createdDevotees[3]._id];
    events[5].registeredDevotees = [createdDevotees[0]._id, createdDevotees[3]._id];
    
    // Add sponsors
    events[0].sponsors = [{
      devoteeId: createdDevotees[3]._id,
      amount: 5100,
      date: new Date('2023-10-15')
    }];
    
    events[2].sponsors = [{
      devoteeId: createdDevotees[2]._id,
      amount: 2100,
      date: new Date('2023-09-10')
    }];
    
    const createdEvents = await Event.insertMany(events);
    console.log(`${createdEvents.length} events inserted`);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Execute the initialization function
initializeDb(); 