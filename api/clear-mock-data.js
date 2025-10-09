const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/user.model');
const Listing = require('./models/listing.model');
const Review = require('./models/review.model');
const Favorite = require('./models/favorite.model');

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://safi:35064612@cluster0-ags3s.mongodb.net/SyProperties?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing all data from database...\n');

    await connectDB();

    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const reviewCount = await Review.countDocuments();
    const favoriteCount = await Favorite.countDocuments();

    console.log('📊 Current data:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🏠 Listings: ${listingCount}`);
    console.log(`   ⭐ Reviews: ${reviewCount}`);
    console.log(`   ❤️  Favorites: ${favoriteCount}\n`);

    await User.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});

    console.log('✅ All data cleared successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();

