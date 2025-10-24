const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Agent = require('./models/agent.model');

// Syrian cities data
const syrianCities = [
  'Latakia',
  'Homs', 
  'Aleppo',
  'Hama',
  'Idlib',
  'Der El Zor',
  'Daraa',
  'Tartous'
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

const addSyrianAgents = async () => {
  try {
    console.log('🇸🇾 Adding Syrian agents with cities data...\n');

    await connectDB();

    // Clear existing agents first
    await Agent.deleteMany({});
    console.log('🗑️  Cleared existing agents\n');

    // Create John agent with multiple Syrian cities
    const johnAgent = new Agent({
      fullName: "John Smith",
      description: "Experienced real estate agent specializing in Syrian properties",
      companyName: "Syrian Properties Ltd",
      position: "Senior Real Estate Agent",
      officeNumber: "+963-11-1234567",
      officeAddress: "Damascus, Syria",
      job: "Real Estate Agent",
      email: "john.smith@syrianproperties.com",
      phone: "+963-11-1234567",
      location: syrianCities.join(', '), // All Syrian cities
      facebook: "https://facebook.com/johnsmith",
      twitter: "https://twitter.com/johnsmith",
      linkedin: "https://linkedin.com/in/johnsmith",
      avatar: "/images/avatar/account.jpg",
      poster: "/images/section/agencies-1.jpg"
    });

    await johnAgent.save();
    console.log('✅ Created John agent with all Syrian cities');

    // Create another agent (Ahmad) with specific Syrian cities
    const ahmadAgent = new Agent({
      fullName: "Ahmad Al-Hassan",
      description: "Local real estate expert with deep knowledge of Syrian market",
      companyName: "Syrian Properties Ltd",
      position: "Real Estate Specialist",
      officeNumber: "+963-21-9876543",
      officeAddress: "Aleppo, Syria",
      job: "Real Estate Agent",
      email: "ahmad.hassan@syrianproperties.com",
      phone: "+963-21-9876543",
      location: "Aleppo, Damascus, Homs, Latakia", // Specific cities
      facebook: "https://facebook.com/ahmadhassan",
      twitter: "https://twitter.com/ahmadhassan",
      linkedin: "https://linkedin.com/in/ahmadhassan",
      avatar: "/images/avatar/account-2.jpg",
      poster: "/images/section/agencies-2.jpg"
    });

    await ahmadAgent.save();
    console.log('✅ Created Ahmad agent with specific Syrian cities');

    // Display summary
    const totalAgents = await Agent.countDocuments();
    console.log(`\n📊 Summary:`);
    console.log(`   👨‍💼 Total Agents: ${totalAgents}`);
    console.log(`   🇸🇾 Syrian Cities Covered: ${syrianCities.length}`);
    console.log(`   🏙️  Cities: ${syrianCities.join(', ')}\n`);

    console.log('✅ Syrian agents added successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding Syrian agents:', error);
    process.exit(1);
  }
};

addSyrianAgents();
