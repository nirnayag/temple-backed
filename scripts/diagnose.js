const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const Devotee = require('../models/Devotee');
const Event = require('../models/Event');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const { Prasadam, PrasadamInfo } = require('../models/Prasadam');
const { Temple, Feature, Section } = require('../models/Temple');

// Connect to MongoDB and run diagnostics
async function runDiagnostics() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple');
    console.log('✅ MongoDB Connected successfully');
    
    // Check mongoose models
    console.log('\n📋 Checking mongoose models:');
    const models = mongoose.models;
    console.log(`Found ${Object.keys(models).length} models: ${Object.keys(models).join(', ')}`);
    
    // Check collections
    console.log('\n📋 Checking MongoDB collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`Found ${collectionNames.length} collections: ${collectionNames.join(', ')}`);
    
    // Check for data in each collection
    console.log('\n📋 Checking for data in collections:');
    
    const templeCount = await Temple.countDocuments();
    console.log(`Temple collection has ${templeCount} documents`);
    
    const featureCount = await Feature.countDocuments();
    console.log(`Feature collection has ${featureCount} documents`);
    
    const sectionCount = await Section.countDocuments();
    console.log(`Section collection has ${sectionCount} documents`);
    
    const prasadamInfoCount = await PrasadamInfo.countDocuments();
    console.log(`PrasadamInfo collection has ${prasadamInfoCount} documents`);
    
    const prasadamCount = await Prasadam.countDocuments();
    console.log(`Prasadam collection has ${prasadamCount} documents`);
    
    const announcementCount = await Announcement.countDocuments();
    console.log(`Announcement collection has ${announcementCount} documents`);
    
    const eventCount = await Event.countDocuments();
    console.log(`Event collection has ${eventCount} documents`);
    
    const devoteeCount = await Devotee.countDocuments();
    console.log(`Devotee collection has ${devoteeCount} documents`);
    
    const userCount = await User.countDocuments();
    console.log(`User collection has ${userCount} documents`);
    
    // Check instance of prasadam info
    if (prasadamInfoCount > 0) {
      console.log('\n📋 Checking prasadamInfo document:');
      const prasadamInfoDoc = await PrasadamInfo.findOne();
      console.log('PrasadamInfo document:', prasadamInfoDoc);
    }

    console.log('\n✅ Diagnostics complete');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Diagnostics failed:', err);
    if (mongoose.connection) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run diagnostics
runDiagnostics(); 