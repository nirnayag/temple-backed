const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

// Configuration options
const config = {
  // Whether to clear existing events before adding new ones
  clearExistingData: false,
  
  // Whether to respect existing data (won't clear if events exist)
  respectExistingData: true,
  
  // Number of sample events to create
  numberOfEvents: 10,
  
  // Days between events
  daysBetweenEvents: 3,
  
  // Log level (1-minimal, 2-normal, 3-verbose)
  logLevel: 2
};

async function populateEvents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    console.log('Connected to MongoDB successfully');

    // Check if events already exist
    const existingCount = await Event.countDocuments();
    
    if (existingCount > 0 && config.respectExistingData) {
      console.log(`There are already ${existingCount} events in the database.`);
      
      // List existing events
      const existingEvents = await Event.find().sort({ date: 1 });
      console.log('\nExisting Events:');
      existingEvents.forEach(event => {
        console.log(`- ${event.title} (${new Date(event.date).toLocaleDateString()}): ${event.eventType}`);
      });
      
      console.log('\nTo add new sample events, set respectExistingData to false in the script configuration.');
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
      process.exit(0);
      return;
    }

    // Clear existing events if configured to do so
    if (config.clearExistingData) {
      console.log('Clearing existing events...');
      await Event.deleteMany({});
      console.log('Existing events cleared');
    }

    // Create array of event types
    const eventTypes = ['puja', 'festival', 'discourse', 'community', 'class', 'cultural'];
    
    // Create events for the next several days
    const events = [];
    const today = new Date();
    
    console.log(`Creating ${config.numberOfEvents} new events...`);
    
    // Create configured number of upcoming events
    for (let i = 0; i < config.numberOfEvents; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + i * config.daysBetweenEvents);
      
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const isPuja = eventType === 'puja';
      const isFestival = eventType === 'festival';
      
      events.push({
        title: isPuja ? 
          `${['Daily', 'Weekly', 'Special', 'Monthly'][Math.floor(Math.random() * 4)]} Temple ${['Worship', 'Puja', 'Ceremony', 'Ritual'][Math.floor(Math.random() * 4)]}` :
          isFestival ? 
            `${['Spring', 'Summer', 'Annual', 'Traditional'][Math.floor(Math.random() * 4)]} Temple ${['Festival', 'Celebration', 'Event'][Math.floor(Math.random() * 3)]}` :
            `${['Community', 'Cultural', 'Educational', 'Spiritual'][Math.floor(Math.random() * 4)]} ${['Gathering', 'Meeting', 'Discussion', 'Seminar'][Math.floor(Math.random() * 4)]}`,
        description: `Join us for this ${eventType} event at the temple. All devotees are welcome to participate.`,
        date: eventDate,
        startTime: `${9 + Math.floor(Math.random() * 8)}:00`,
        endTime: `${14 + Math.floor(Math.random() * 6)}:00`,
        location: `${['Main Temple Hall', 'Community Center', 'Meditation Room', 'Outdoor Pavilion'][Math.floor(Math.random() * 4)]}`,
        eventType: eventType,
        priest: isPuja ? `Temple Priest ${Math.floor(Math.random() * 5) + 1}` : null,
        deity: isPuja ? `${['Vishnu', 'Shiva', 'Lakshmi', 'Ganesha', 'Durga'][Math.floor(Math.random() * 5)]}` : null,
        sponsorshipAvailable: Math.random() > 0.5,
        sponsorshipAmount: Math.random() > 0.5 ? (Math.floor(Math.random() * 10) + 1) * 100 : 0,
        registrationRequired: Math.random() > 0.7,
        registrationFee: Math.random() > 0.8 ? (Math.floor(Math.random() * 5) + 1) * 10 : 0,
        maxAttendees: Math.random() > 0.7 ? (Math.floor(Math.random() * 10) + 5) * 10 : null,
        isActive: true
      });
    }
    
    // Insert events to the database
    await Event.insertMany(events);
    console.log(`${events.length} events created successfully!`);
    
    // Display newly created events
    const createdEvents = await Event.find({}).sort({ date: 1 });
    console.log('\nUpcoming Events:');
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${new Date(event.date).toLocaleDateString()}): ${event.eventType}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error populating events:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the population script
populateEvents(); 