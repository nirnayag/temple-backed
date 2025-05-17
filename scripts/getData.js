const mongoose = require('mongoose');
const Devotee = require('../models/Devotee');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

// Function to retrieve all data
async function getAllData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    console.log('Connected to MongoDB temple database\n');

    // Get devotees data
    const devotees = await Devotee.find();
    console.log(`Found ${devotees.length} devotees:`);
    devotees.forEach(devotee => {
      console.log(`- ${devotee.name} (${devotee.email}), Membership: ${devotee.membershipType}`);
      if (devotee.donationHistory && devotee.donationHistory.length > 0) {
        console.log(`  Donations: ${devotee.donationHistory.length}`);
        devotee.donationHistory.forEach(donation => {
          console.log(`  - ${new Date(donation.date).toLocaleDateString()}: $${donation.amount} (${donation.purpose || 'General'})`);
        });
      }
    });
    console.log('\n');

    // Get events data
    const events = await Event.find();
    console.log(`Found ${events.length} events:`);
    events.forEach(event => {
      console.log(`- ${event.title} (${new Date(event.date).toLocaleDateString()}), Type: ${event.eventType}`);
      console.log(`  Location: ${event.location}, Time: ${event.startTime}-${event.endTime}`);
      console.log(`  Registered devotees: ${event.registeredDevotees?.length || 0}`);
    });
    console.log('\n');

    // Get users data
    const users = await User.find().select('-password');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}), Role: ${user.role}`);
      console.log(`  Linked to devotee: ${user.devoteeId}`);
    });

  } catch (error) {
    console.error('Error retrieving data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Execute the function
getAllData(); 