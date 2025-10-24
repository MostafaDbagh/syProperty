const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Listing = require('./models/listing.model');
const Agent = require('./models/agent.model');

// Syrian cities data
const syrianCities = [
  { name: 'Damascus', lat: 33.5138, lng: 36.2765 },
  { name: 'Latakia', lat: 35.5167, lng: 35.7833 },
  { name: 'Homs', lat: 34.7333, lng: 36.7167 },
  { name: 'Aleppo', lat: 36.2000, lng: 37.1500 },
  { name: 'Hama', lat: 35.1333, lng: 36.7500 },
  { name: 'Idlib', lat: 35.9333, lng: 36.6333 },
  { name: 'Der El Zor', lat: 35.3333, lng: 40.1500 },
  { name: 'Daraa', lat: 32.6167, lng: 36.1000 },
  { name: 'Tartous', lat: 34.8833, lng: 35.8833 }
];

// Property types and descriptions
const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio', 'Duplex'];
const propertyKeywords = ['Luxury', 'Modern', 'Traditional', 'Cozy', 'Spacious'];
const propertyDescriptions = [
  'Beautiful modern property with excellent location',
  'Traditional Syrian architecture with modern amenities',
  'Spacious property perfect for families',
  'Luxury property with stunning views',
  'Cozy home in quiet neighborhood'
];

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

const generateRandomProperty = (city, agentName) => {
  const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const randomKeyword = propertyKeywords[Math.floor(Math.random() * propertyKeywords.length)];
  const randomDesc = propertyDescriptions[Math.floor(Math.random() * propertyDescriptions.length)];
  
  return {
    propertyId: `SYR_${city.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    propertyType: randomType,
    propertyKeyword: randomKeyword,
    propertyDesc: `${randomDesc} in ${city}`,
    description: `${randomDesc} located in the beautiful city of ${city}, Syria`,
    propertyPrice: Math.floor(Math.random() * 500000) + 50000, // $50k to $550k
    status: Math.random() > 0.5 ? 'sale' : 'rent',
    rentType: Math.random() > 0.5 ? 'monthly' : 'yearly',
    bedrooms: Math.floor(Math.random() * 5) + 1, // 1-5 bedrooms
    bathrooms: Math.floor(Math.random() * 4) + 1, // 1-4 bathrooms
    size: Math.floor(Math.random() * 300) + 80, // 80-380 sqm
    squareFootage: Math.floor(Math.random() * 3000) + 800, // 800-3800 sqft
    landArea: Math.floor(Math.random() * 500) + 100, // 100-600 sqm
    furnished: Math.random() > 0.5,
    garages: Math.random() > 0.3,
    garageSize: Math.floor(Math.random() * 3) + 1, // 1-3 cars
    yearBuilt: Math.floor(Math.random() * 30) + 1990, // 1990-2020
    amenities: ['Parking', 'Garden', 'Balcony', 'Security'].slice(0, Math.floor(Math.random() * 4) + 1),
    address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${city}`,
    country: 'Syria',
    state: city,
    neighborhood: `${city} Downtown`,
    agent: agentName,
    agentEmail: agentName === 'John Smith' ? 'john.smith@syrianproperties.com' : 'ahmad.hassan@syrianproperties.com',
    agentNumber: agentName === 'John Smith' ? '+963-11-1234567' : '+963-21-9876543',
    agentWhatsapp: agentName === 'John Smith' ? '+963-11-1234567' : '+963-21-9876543',
    approvalStatus: 'approved',
    isSold: false,
    isDeleted: false,
    offer: Math.random() > 0.7, // 30% chance of having an offer
    visitCount: Math.floor(Math.random() * 100),
    imageNames: [
      '/images/section/box-house-1.jpg',
      '/images/section/box-house-2.jpg',
      '/images/section/box-house-3.jpg'
    ],
    images: [
      { publicId: `syrian_property_${Date.now()}_1` },
      { publicId: `syrian_property_${Date.now()}_2` },
      { publicId: `syrian_property_${Date.now()}_3` }
    ]
  };
};

const addSyrianListings = async () => {
  try {
    console.log('🇸🇾 Adding Syrian property listings...\n');

    await connectDB();

    // Get existing agents
    const agents = await Agent.find({});
    if (agents.length === 0) {
      console.log('❌ No agents found. Please run add-syrian-agents.js first.');
      process.exit(1);
    }

    console.log(`📋 Found ${agents.length} agents`);

    // Clear existing listings first
    await Listing.deleteMany({});
    console.log('🗑️  Cleared existing listings\n');

    const listings = [];
    const listingsPerCity = 3; // 3 listings per city
    const totalListings = syrianCities.length * listingsPerCity;

    console.log(`🏗️  Creating ${totalListings} property listings...`);

    // Create listings for each Syrian city
    for (const city of syrianCities) {
      for (let i = 0; i < listingsPerCity; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const property = generateRandomProperty(city.name, agent.fullName);
        listings.push(property);
      }
    }

    // Insert all listings
    await Listing.insertMany(listings);

    // Display summary
    const totalListingsCount = await Listing.countDocuments();
    const listingsByCity = await Listing.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`\n📊 Summary:`);
    console.log(`   🏠 Total Listings: ${totalListingsCount}`);
    console.log(`   🇸🇾 Cities with Properties:`);
    listingsByCity.forEach(city => {
      console.log(`      📍 ${city._id}: ${city.count} properties`);
    });

    console.log(`\n✅ Syrian property listings added successfully!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding Syrian listings:', error);
    process.exit(1);
  }
};

addSyrianListings();
