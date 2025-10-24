const mongoose = require('mongoose');
const User = require('./models/user.model');
const Listing = require('./models/listing.model');
const Review = require('./models/review.model');
const Favorite = require('./models/favorite.model');
const Agent = require('./models/agent.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(() => {
    console.log('✅ MongoDB Connected');
    return clearAndSeedData();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

async function clearAndSeedData() {
  try {
    console.log('🗑️  Clearing all existing data...');
    
    // Clear all collections
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
    await Agent.deleteMany({});
    
    console.log('✅ All data cleared');

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

    // Create 5 agents
    const agents = [
      {
        fullName: 'John Smith',
        description: 'Experienced real estate agent specializing in Damascus and surrounding areas',
        companyName: 'Syria Real Estate Group',
        position: 'Senior Agent',
        officeNumber: '+963995278383',
        officeAddress: 'Baghdad street, Latakia, Syria',
        job: 'Real Estate Agent',
        email: 'john.smith@syria-realestate.com',
        phone: '+963995278383',
        location: 'Damascus',
        facebook: 'https://facebook.com/johnsmith',
        twitter: 'https://twitter.com/johnsmith',
        linkedin: 'https://linkedin.com/in/johnsmith',
        avatar: '/images/avatar/agent-1.jpg',
        poster: '/images/avatar/agent-poster-1.jpg'
      },
      {
        fullName: 'Ahmad Al-Hassan',
        description: 'Expert in coastal properties in Latakia and Tartous',
        companyName: 'Mediterranean Properties',
        position: 'Coastal Specialist',
        officeNumber: '+963995278384',
        officeAddress: 'Corniche Street, Latakia, Syria',
        job: 'Real Estate Agent',
        email: 'ahmad.alhassan@mediterranean-properties.com',
        phone: '+963995278384',
        location: 'Latakia',
        facebook: 'https://facebook.com/ahmadalhassan',
        twitter: 'https://twitter.com/ahmadalhassan',
        linkedin: 'https://linkedin.com/in/ahmadalhassan',
        avatar: '/images/avatar/agent-2.jpg',
        poster: '/images/avatar/agent-poster-2.jpg'
      },
      {
        fullName: 'Fatima Al-Zahra',
        description: 'Specialist in Aleppo and northern Syria properties',
        companyName: 'Northern Syria Realty',
        position: 'Northern Specialist',
        officeNumber: '+963995278385',
        officeAddress: 'Al-Jalaa Street, Aleppo, Syria',
        job: 'Real Estate Agent',
        email: 'fatima.alzahra@northern-syria.com',
        phone: '+963995278385',
        location: 'Aleppo',
        facebook: 'https://facebook.com/fatimaalzahra',
        twitter: 'https://twitter.com/fatimaalzahra',
        linkedin: 'https://linkedin.com/in/fatimaalzahra',
        avatar: '/images/avatar/agent-3.jpg',
        poster: '/images/avatar/agent-poster-3.jpg'
      },
      {
        fullName: 'Omar Al-Mahmoud',
        description: 'Expert in Homs and central Syria properties',
        companyName: 'Central Syria Properties',
        position: 'Central Specialist',
        officeNumber: '+963995278386',
        officeAddress: 'Al-Hamidiyah Street, Homs, Syria',
        job: 'Real Estate Agent',
        email: 'omar.almahmoud@central-syria.com',
        phone: '+963995278386',
        location: 'Homs',
        facebook: 'https://facebook.com/omaralmahmoud',
        twitter: 'https://twitter.com/omaralmahmoud',
        linkedin: 'https://linkedin.com/in/omaralmahmoud',
        avatar: '/images/avatar/agent-4.jpg',
        poster: '/images/avatar/agent-poster-4.jpg'
      },
      {
        fullName: 'Layla Al-Rashid',
        description: 'Specialist in Daraa and southern Syria properties',
        companyName: 'Southern Syria Realty',
        position: 'Southern Specialist',
        officeNumber: '+963995278387',
        officeAddress: 'Al-Manshiyah Street, Daraa, Syria',
        job: 'Real Estate Agent',
        email: 'layla.alrashid@southern-syria.com',
        phone: '+963995278387',
        location: 'Daraa',
        facebook: 'https://facebook.com/laylaalrashid',
        twitter: 'https://twitter.com/laylaalrashid',
        linkedin: 'https://linkedin.com/in/laylaalrashid',
        avatar: '/images/avatar/agent-5.jpg',
        poster: '/images/avatar/agent-poster-5.jpg'
      }
    ];

    console.log('👨‍💼 Creating 5 agents...');
    const createdAgents = [];
    for (const agentData of agents) {
      const agent = new Agent(agentData);
      const savedAgent = await agent.save();
      createdAgents.push(savedAgent);
      console.log(`✅ Created agent: ${savedAgent.fullName}`);
    }

    console.log('🏠 Creating listings for each agent...');
    
    // Property types and features
    const propertyTypes = ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Land'];
    const statuses = ['sale', 'rent'];
    const rentTypes = ['monthly', 'yearly'];
    
    let totalListings = 0;
    
    for (const agent of createdAgents) {
      // Each agent gets 8-12 listings across different cities
      const listingsCount = Math.floor(Math.random() * 5) + 8; // 8-12 listings
      
      for (let i = 0; i < listingsCount; i++) {
        const city = syrianCities[Math.floor(Math.random() * syrianCities.length)];
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const bedrooms = Math.floor(Math.random() * 5) + 1; // 1-5 bedrooms
        const bathrooms = Math.floor(Math.random() * 4) + 1; // 1-4 bathrooms
        const size = Math.floor(Math.random() * 300) + 50; // 50-350 sqm
        
        const listingData = {
          propertyId: `SYR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          propertyType,
          propertyKeyword: `${propertyType.toLowerCase()} in ${city.name}`,
          propertyDesc: `Beautiful ${propertyType.toLowerCase()} in ${city.name}, Syria. Perfect for ${status === 'sale' ? 'buying' : 'renting'}.`,
          description: `This stunning ${propertyType.toLowerCase()} features ${bedrooms} bedrooms and ${bathrooms} bathrooms. Located in the heart of ${city.name}, this property offers modern amenities and excellent connectivity.`,
          propertyPrice: status === 'sale' ? 
            Math.floor(Math.random() * 200000) + 50000 : // $50k-$250k for sale
            Math.floor(Math.random() * 2000) + 500, // $500-$2500 for rent
          status,
          rentType: status === 'rent' ? rentTypes[Math.floor(Math.random() * rentTypes.length)] : undefined,
          bedrooms,
          bathrooms,
          size,
          squareFootage: size,
          furnished: Math.random() > 0.5,
          garages: Math.random() > 0.3,
          garageSize: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : undefined,
          yearBuilt: Math.floor(Math.random() * 30) + 1990, // 1990-2020
          amenities: ['Parking', 'Security', 'Garden', 'Balcony', 'Air Conditioning'].slice(0, Math.floor(Math.random() * 3) + 2),
          address: `${Math.floor(Math.random() * 999) + 1} ${city.name} Street, ${city.name}, Syria`,
          country: 'Syria',
          state: city.name,
          neighborhood: `${city.name} Downtown`,
          agent: agent.fullName, // String reference for backward compatibility
          agentId: agent._id, // Proper ObjectId reference
          agentEmail: agent.email,
          agentNumber: agent.phone,
          agentWhatsapp: agent.phone,
          approvalStatus: 'approved',
          isSold: false,
          isDeleted: false,
          offer: Math.random() > 0.7,
          visitCount: Math.floor(Math.random() * 100),
          imageNames: [
            `/images/properties/${propertyType.toLowerCase()}-1.jpg`,
            `/images/properties/${propertyType.toLowerCase()}-2.jpg`,
            `/images/properties/${propertyType.toLowerCase()}-3.jpg`
          ],
          images: [
            {
              publicId: `properties/${propertyType.toLowerCase()}-1`,
              url: `/images/properties/${propertyType.toLowerCase()}-1.jpg`,
              filename: `${propertyType.toLowerCase()}-1.jpg`
            },
            {
              publicId: `properties/${propertyType.toLowerCase()}-2`,
              url: `/images/properties/${propertyType.toLowerCase()}-2.jpg`,
              filename: `${propertyType.toLowerCase()}-2.jpg`
            }
          ]
        };

        const listing = new Listing(listingData);
        await listing.save();
        totalListings++;
      }
      
      console.log(`✅ Created ${listingsCount} listings for ${agent.fullName}`);
    }

    console.log('\n📊 Summary:');
    console.log(`   👨‍💼 Total Agents: ${createdAgents.length}`);
    console.log(`   🏠 Total Listings: ${totalListings}`);
    console.log(`   🇸🇾 Syrian Cities: ${syrianCities.length}`);
    console.log(`   🏙️  Cities: ${syrianCities.map(c => c.name).join(', ')}`);
    
    console.log('\n✅ Data seeding completed successfully!');
    console.log('🔗 Every listing now has a proper agent reference!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
    process.exit(1);
  }
}
