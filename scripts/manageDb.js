const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Devotee = require('../models/Devotee');
const Event = require('../models/Event');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const { Prasadam, PrasadamInfo } = require('../models/Prasadam');
const { Temple, Feature, Section } = require('../models/Temple');
require('dotenv').config();

// Command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'check';

// Configuration options
const config = {
  // Action to perform: check, reset, backup, or restore
  action: command,
  
  // Database connection
  dbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/temple',
  
  // Backup path
  backupDir: path.join(__dirname, '../backups'),
  
  // Collections to manage
  collections: {
    templeInfo: { model: Temple, name: 'Temple Info' },
    features: { model: Feature, name: 'Features' },
    sections: { model: Section, name: 'Sections' },
    prasadamInfo: { model: PrasadamInfo, name: 'Prasadam Info' },
    prasadam: { model: Prasadam, name: 'Prasadam' },
    announcements: { model: Announcement, name: 'Announcements' },
    events: { model: Event, name: 'Events' },
    devotees: { model: Devotee, name: 'Devotees' },
    users: { model: User, name: 'Users' }
  },
  
  // Log level (1-minimal, 2-normal, 3-verbose)
  logLevel: 2
};

// Helper function to connect to MongoDB
async function connectToDb() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.dbUri);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
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

// Helper function to clear a collection
async function clearCollection(model) {
  try {
    const collectionName = model.collection.collectionName;
    console.log(`Clearing ${collectionName} collection...`);
    await model.deleteMany({});
    console.log(`${collectionName} collection cleared`);
    return true;
  } catch (err) {
    console.error(`Error clearing ${model.collection.collectionName} collection:`, err);
    return false;
  }
}

// Helper function to get collection status
async function checkCollections() {
  console.log('\nCollection Status:');
  
  for (const [key, { model, name }] of Object.entries(config.collections)) {
    const isEmpty = await isCollectionEmpty(model);
    const count = await model.countDocuments();
    console.log(`- ${name}: ${isEmpty ? 'Empty' : `Has ${count} document(s)`}`);
  }
}

// Helper function to reset all collections
async function resetCollections() {
  console.log('\nResetting all collections:');
  
  for (const [key, { model, name }] of Object.entries(config.collections)) {
    const result = await clearCollection(model);
    if (result) {
      console.log(`✅ ${name} cleared successfully`);
    } else {
      console.log(`❌ Failed to clear ${name}`);
    }
  }
  
  // Check if an admin user exists
  await createDefaultAdminUser();
}

// Helper function to create a default admin user
async function createDefaultAdminUser() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      console.log('No admin user found in the database');
      console.log('To create an admin user, use the API endpoint or database tools');
    } else {
      console.log('Admin user exists in the database');
    }
    return true;
  } catch (err) {
    console.error('Error checking admin user:', err);
    return false;
  }
}

// Helper function to backup collections
async function backupCollections() {
  console.log('\nBacking up collections:');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const backupPath = path.join(config.backupDir, `backup-${timestamp}`);
  fs.mkdirSync(backupPath, { recursive: true });
  
  for (const [key, { model, name }] of Object.entries(config.collections)) {
    try {
      const data = await model.find({});
      
      if (data.length > 0) {
        const filePath = path.join(backupPath, `${key}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ ${name} backed up successfully (${data.length} documents)`);
      } else {
        console.log(`⏭️ Skipping ${name} (empty collection)`);
      }
    } catch (err) {
      console.error(`Error backing up ${name}:`, err);
      console.log(`❌ Failed to backup ${name}`);
    }
  }
  
  console.log(`\nBackup completed: ${backupPath}`);
  return backupPath;
}

// Helper function to restore collections from backup
async function restoreCollections() {
  try {
    // Find the latest backup
    if (!fs.existsSync(config.backupDir)) {
      console.error('No backup directory found');
      return false;
    }
    
    const backups = fs.readdirSync(config.backupDir);
    if (backups.length === 0) {
      console.error('No backups found');
      return false;
    }
    
    const latestBackup = backups
      .filter(name => name.startsWith('backup-'))
      .sort()
      .pop();
    
    if (!latestBackup) {
      console.error('No valid backups found');
      return false;
    }
    
    const backupPath = path.join(config.backupDir, latestBackup);
    console.log(`\nRestoring from backup: ${backupPath}`);
    
    for (const [key, { model, name }] of Object.entries(config.collections)) {
      const filePath = path.join(backupPath, `${key}.json`);
      
      if (fs.existsSync(filePath)) {
        try {
          // Clear existing data
          await model.deleteMany({});
          
          // Read and parse backup data
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          if (data.length > 0) {
            await model.insertMany(data);
            console.log(`✅ ${name} restored successfully (${data.length} documents)`);
          } else {
            console.log(`⏭️ Skipping ${name} (empty backup)`);
          }
        } catch (err) {
          console.error(`Error restoring ${name}:`, err);
          console.log(`❌ Failed to restore ${name}`);
        }
      } else {
        console.log(`⏭️ Skipping ${name} (no backup file)`);
      }
    }
    
    console.log('\nRestore completed');
    return true;
  } catch (err) {
    console.error('Error restoring collections:', err);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log(`\n==== Temple Database Management ====`);
    console.log(`Action: ${config.action}\n`);
    
    // Connect to MongoDB
    const connected = await connectToDb();
    if (!connected) {
      process.exit(1);
    }
    
    // Execute the requested action
    switch (config.action) {
      case 'check':
        await checkCollections();
        break;
      case 'reset':
        await resetCollections();
        break;
      case 'backup':
        await backupCollections();
        break;
      case 'restore':
        await restoreCollections();
        break;
      default:
        console.log('Available commands: check, reset, backup, restore');
        break;
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the script
main(); 