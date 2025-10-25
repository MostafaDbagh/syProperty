const mongoose = require('mongoose');
require('dotenv').config();

const Listing = require('./models/listing.model');

const migrateStateToCity = async () => {
  try {
    console.log('Connecting to database...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    const db = require('./db/connect');
    await db;
    console.log('Connected to database');

    // Update all listings where city field doesn't exist but state exists
    const result = await Listing.updateMany(
      {
        $or: [
          { city: { $exists: false } },
          { city: null },
          { city: '' }
        ],
        state: { $exists: true, $ne: null, $ne: '' }
      },
      [
        {
          $set: {
            city: '$state'
          }
        }
      ]
    );

    console.log('Migration completed:');
    console.log(`- Documents matched: ${result.matchedCount}`);
    console.log(`- Documents modified: ${result.modifiedCount}`);

    await mongoose.connection.close();
    console.log('Migration script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateStateToCity();
