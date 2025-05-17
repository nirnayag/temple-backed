const mongoose = require('mongoose');
const Devotee = require('../models/Devotee');
const Event = require('../models/Event');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const { Prasadam, PrasadamInfo } = require('../models/Prasadam');
const { Temple, Feature, Section } = require('../models/Temple');
require('dotenv').config();

// Configuration options
const config = {
  // Whether to clear existing data before initialization
  clearExistingData: false,
  
  // Whether to check collections and report their status
  checkCollections: true,
  
  // Collections to check
  collections: {
    templeInfo: true,
    features: true,
    sections: true,
    prasadamInfo: true,
    prasadam: true,
    announcements: true,
    events: true,
    devotees: true,
    users: true
  },
  
  // Log level (1-minimal, 2-normal, 3-verbose)
  logLevel: 2
};

// Helper function to clear a collection
async function clearCollection(model) {
  try {
    if (config.logLevel >= 2) {
      console.log(`Clearing ${model.collection.collectionName} collection`);
    }
    await model.deleteMany({});
    return true;
  } catch (err) {
    console.error(`Error clearing ${model.collection.collectionName} collection:`, err);
    return false;
  }
}

// Helper function to check if a collection is empty
async function isCollectionEmpty(model) {
  try {
    const count = await model.countDocuments();
    return count === 0;
  } catch (err) {
    console.error(`Error checking if ${model.collection.collectionName} is empty:`, err);
    return false;
  }
}

// Main initialization function
async function initializeDb() {
  try {
    if (config.logLevel >= 1) {
      console.log('Starting database check...');
    }
    
    // Connect to MongoDB
    if (config.logLevel >= 2) {
      console.log('Connecting to MongoDB...');
    }
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    if (config.logLevel >= 2) {
      console.log('Connected to MongoDB successfully');
    }
    
    // Initialize results
    const results = {
      empty: 0,
      populated: 0,
      total: 0
    };
    
    // Check all collections for empty state
    if (config.checkCollections) {
      console.log('\nCollection Status:');
      
      // Check Temple information
      if (config.collections.templeInfo) {
        const isEmpty = await isCollectionEmpty(Temple);
        console.log(`- Temple information: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Features
      if (config.collections.features) {
        const isEmpty = await isCollectionEmpty(Feature);
        console.log(`- Features: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Sections
      if (config.collections.sections) {
        const isEmpty = await isCollectionEmpty(Section);
        console.log(`- Sections: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Prasadam Info
      if (config.collections.prasadamInfo) {
        const isEmpty = await isCollectionEmpty(PrasadamInfo);
        console.log(`- Prasadam info: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Prasadam
      if (config.collections.prasadam) {
        const isEmpty = await isCollectionEmpty(Prasadam);
        console.log(`- Prasadam: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Announcements
      if (config.collections.announcements) {
        const isEmpty = await isCollectionEmpty(Announcement);
        console.log(`- Announcements: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Events
      if (config.collections.events) {
        const isEmpty = await isCollectionEmpty(Event);
        console.log(`- Events: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Devotees
      if (config.collections.devotees) {
        const isEmpty = await isCollectionEmpty(Devotee);
        console.log(`- Devotees: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
      
      // Check Users
      if (config.collections.users) {
        const isEmpty = await isCollectionEmpty(User);
        console.log(`- Users: ${isEmpty ? 'Empty' : 'Has data'}`);
        isEmpty ? results.empty++ : results.populated++;
        results.total++;
      }
    }
    
    // Display summary
    if (config.logLevel >= 1) {
      console.log('\nDatabase status summary:');
      console.log(`✅ ${results.populated} collections have data`);
      console.log(`⚠️ ${results.empty} collections are empty`);
      console.log(`Total: ${results.total} collections checked`);
      
      // Provide help message if collections are empty
      if (results.empty > 0) {
        console.log('\nTo populate empty collections, you can use:');
        console.log('- scripts/manageDb.js restore  (to restore from backup)');
        console.log('- scripts/populateEvents.js    (to add sample events)');
      }
      
      console.log('\nDatabase check completed');
    }
    
    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Database check failed:', err);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the initialization
initializeDb(); 