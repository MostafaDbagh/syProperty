const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Agent = require('./models/agent.model');
const Listing = require('./models/listing.model');
const Review = require('./models/review.model');
const Message = require('./models/message.model');
const Favorite = require('./models/favorite.model');
const User = require('./models/user.model');

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

// Property types
const propertyTypes = ['Land', 'Commercial', 'Apartment', 'Holiday Home', 'Villa', 'Office'];

// Property types mapping
const propertyTypeMapping = {
  'Land': ['Residential Land', 'Commercial Land', 'Agricultural Land'],
  'Commercial': ['Shop', 'Warehouse', 'Restaurant', 'Hotel'],
  'Apartment': ['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms'],
  'Holiday Home': ['Beach House', 'Mountain Cabin', 'Country House'],
  'Villa': ['Luxury Villa', 'Family Villa', 'Garden Villa'],
  'Office': ['Small Office', 'Executive Office', 'Shared Office']
};

// Agent names
const agentNames = [
  { first: 'Ahmad', last: 'Al-Hassan' },
  { first: 'Mohammad', last: 'Ali' },
  { first: 'Hassan', last: 'Ibrahim' },
  { first: 'Omar', last: 'Mahmoud' },
  { first: 'Khalil', last: 'Abdullah' },
  { first: 'Youssef', last: 'Salim' },
  { first: 'Ziad', last: 'Malek' },
  { first: 'Rami', last: 'Nasser' },
  { first: 'Bassam', last: 'Hamdi' },
  { first: 'Tarek', last: 'Farouk' }
];

// Review names and content
const reviewNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'William Thomas', 'Jessica Garcia',
  'James Rodriguez', 'Ashley Lewis', 'Daniel Walker', 'Amanda Hall', 'Christopher Allen'
];

const reviewComments = [
  'Excellent property! Very satisfied with the purchase.',
  'Great location and beautiful property. Highly recommended!',
  'Professional service and amazing property.',
  'Love this property! Everything was perfect.',
  'Outstanding quality and value for money.',
  'Very happy with our decision. Great investment.',
  'Beautiful property with all the amenities we needed.',
  'Professional agent and smooth transaction process.',
  'Amazing property! Exceeded our expectations.',
  'Great experience overall. Would definitely recommend.',
  'Perfect property in a prime location.',
  'Excellent value and quality.',
  'Very satisfied with the property and service.',
  'Great investment opportunity with good potential.',
  'Love the modern design and excellent location.'
];

const messageSubjects = [
  'Interested in viewing this property',
  'Question about property details',
  'Schedule a property viewing',
  'More information about this property',
  'Price negotiation inquiry',
  'Property availability inquiry',
  'Financing options available?',
  'Investment opportunity inquiry'
];

const messageBodies = [
  'I am very interested in viewing this property. Please contact me to schedule a visit.',
  'I would like to know more details about this property before making a decision.',
  'Please let me know when I can schedule a viewing of this property.',
  'Could you provide more information about this property and its amenities?',
  'I am interested in this property. Is the price negotiable?',
  'Is this property still available? I would like to arrange a viewing.',
  'What financing options are available for this property?',
  'I see great investment potential. Can we discuss further details?'
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

const generateRandomProperty = (city, agent) => {
  const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const subTypes = propertyTypeMapping[randomType];
  const randomSubType = subTypes[Math.floor(Math.random() * subTypes.length)];
  
  // Map to correct frontend property types
  let frontendPropertyType = randomType;
  if (randomType === 'Villa') {
    frontendPropertyType = 'Villa/farms'; // Frontend uses 'Villa/farms'
  } else if (randomType === 'Land') {
    frontendPropertyType = 'Land'; // Frontend uses 'Land' (displayed as 'Land/Plot')
  } else if (randomType === 'Holiday Home') {
    frontendPropertyType = 'Holiday Home';
  } else if (randomType === 'Commercial') {
    frontendPropertyType = 'Commercial';
  } else if (randomType === 'Office') {
    frontendPropertyType = 'Office';
  } else if (randomType === 'Apartment') {
    frontendPropertyType = 'Apartment';
  }
  
  // Adjust price range based on property type
  let minPrice, maxPrice;
  switch (randomType) {
    case 'Land':
      minPrice = 10000;
      maxPrice = 200000;
      break;
    case 'Commercial':
      minPrice = 50000;
      maxPrice = 500000;
      break;
    case 'Apartment':
      minPrice = 30000;
      maxPrice = 300000;
      break;
    case 'Holiday Home':
      minPrice = 80000;
      maxPrice = 400000;
      break;
    case 'Villa':
      minPrice = 100000;
      maxPrice = 600000;
      break;
    case 'Office':
      minPrice = 40000;
      maxPrice = 400000;
      break;
  }

  const isRent = Math.random() > 0.4; // 60% chance of rent
  const propertyPrice = Math.floor(Math.random() * (maxPrice - minPrice)) + minPrice;

  const bedrooms = randomType !== 'Land' && randomType !== 'Commercial' ? Math.floor(Math.random() * 5) + 1 : 0;
  const bathrooms = randomType !== 'Land' && randomType !== 'Commercial' ? Math.floor(Math.random() * 4) + 1 : 0;
  const size = Math.floor(Math.random() * 500) + 100;

  return {
    propertyId: `SYR_${city.name.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    propertyType: frontendPropertyType, // Use the correct frontend property type
    propertyKeyword: randomSubType,
    propertyDesc: `${randomSubType} in ${city.name}, ${randomType}`,
    description: `Beautiful ${randomSubType} located in the heart of ${city.name}, Syria. ${randomType === 'Land' ? 'Perfect for development or investment.' : 'Ready for immediate use.'}`,
    propertyPrice,
    status: isRent ? 'rent' : 'sale',
    rentType: isRent ? (Math.random() > 0.5 ? 'monthly' : 'yearly') : undefined,
    bedrooms,
    bathrooms,
    size,
    squareFootage: size * 10.764, // Convert sqm to sqft
    landArea: Math.floor(Math.random() * 1000) + 200,
    furnished: randomType === 'Apartment' || randomType === 'Office' ? Math.random() > 0.3 : false,
    garages: Math.random() > 0.4,
    garageSize: Math.floor(Math.random() * 3) + 1,
    yearBuilt: Math.floor(Math.random() * 30) + 1995,
    amenities: ['Parking', 'Security', 'Garden', 'Balcony', 'Elevator'].slice(0, Math.floor(Math.random() * 4) + 2),
    address: `${Math.floor(Math.random() * 999) + 1} ${['Main Street', 'Park Avenue', 'Garden Road', 'Central Square', 'Market Street'][Math.floor(Math.random() * 5)]}, ${city.name}`,
    country: 'Syria',
    city: city.name,
    state: city.name,
    neighborhood: `${city.name} ${['Downtown', 'City Center', 'New District', 'Old Town', 'Residential Area'][Math.floor(Math.random() * 5)]}`,
    agent: `${agent.first} ${agent.last}`,
    agentEmail: agent.email,
    agentNumber: agent.phone,
    agentWhatsapp: agent.phone,
    approvalStatus: 'approved',
    isSold: false,
    isDeleted: false,
    offer: Math.random() > 0.7,
    visitCount: Math.floor(Math.random() * 200),
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

const addComprehensiveData = async () => {
  try {
    console.log('🏗️  Building comprehensive database...\n');

    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Agent.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Favorite.deleteMany({});
    console.log('✅ All data cleared\n');

    // Create agents
    console.log('👨‍💼 Creating 10 agents...');
    const agents = [];
    for (let i = 0; i < agentNames.length; i++) {
      const agent = agentNames[i];
      const agentData = new Agent({
        fullName: `${agent.first} ${agent.last}`,
        description: `Experienced real estate professional specializing in Syrian properties`,
        companyName: `Syrian Properties ${i + 1}`,
        position: 'Senior Real Estate Agent',
        officeNumber: `+963-11-${String(i + 1).padStart(7, '0')}`,
        officeAddress: `${syrianCities[i % syrianCities.length].name}, Syria`,
        job: 'Real Estate Agent',
        email: `${agent.first.toLowerCase()}.${agent.last.toLowerCase()}@syrianproperties.com`,
        phone: `+963-11-${String(i + 1).padStart(7, '0')}`,
        location: syrianCities.map(c => c.name).join(', '),
        facebook: `https://facebook.com/${agent.first.toLowerCase()}${agent.last.toLowerCase()}`,
        twitter: `https://twitter.com/${agent.first.toLowerCase()}${agent.last.toLowerCase()}`,
        linkedin: `https://linkedin.com/in/${agent.first.toLowerCase()}-${agent.last.toLowerCase()}`,
        avatar: `/images/avatar/account${Math.floor(i / 3) % 3 + 1}.jpg`,
        poster: `/images/section/agencies-${Math.floor(i / 3) % 3 + 1}.jpg`
      });
      await agentData.save();
      agents.push(agentData);
      console.log(`✅ Created agent: ${agent.first} ${agent.last}`);
    }
    console.log(`✅ Created ${agents.length} agents\n`);

    // Create listings
    console.log('🏠 Creating 100 property listings...');
    const totalListings = 100;
    const listings = [];
    
    for (let i = 0; i < totalListings; i++) {
      const city = syrianCities[i % syrianCities.length];
      const agentIndex = i % agents.length;
      const agent = {
        first: agentNames[agentIndex].first,
        last: agentNames[agentIndex].last,
        email: agents[agentIndex].email,
        phone: agents[agentIndex].phone
      };
      
      const property = generateRandomProperty(city, agent);
      const listing = new Listing(property);
      await listing.save();
      listings.push(listing);
      
      if ((i + 1) % 20 === 0) {
        console.log(`   📝 Created ${i + 1}/${totalListings} listings...`);
      }
    }
    console.log(`✅ Created ${listings.length} listings\n`);

    // Create reviews
    console.log('⭐ Creating reviews...');
    const reviewsCreated = [];
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per property
      
      for (let j = 0; j < numReviews; j++) {
        const reviewName = reviewNames[Math.floor(Math.random() * reviewNames.length)];
        const review = new Review({
          propertyId: listing._id.toString(),
          userId: null,
          name: reviewName,
          email: `${reviewName.toLowerCase().replace(' ', '.')}@email.com`,
          review: reviewComments[Math.floor(Math.random() * reviewComments.length)],
          rating: Math.floor(Math.random() * 2) + 4 // 4-5 rating
        });
        await review.save();
        reviewsCreated.push(review);
      }
    }
    console.log(`✅ Created ${reviewsCreated.length} reviews\n`);

    // Create messages
    console.log('📧 Creating messages...');
    const messagesCreated = [];
    const messageSenders = [
      { name: 'Ali Mohamad', email: 'ali.mohamad@email.com', phone: '+963-11-1234567' },
      { name: 'Sara Ahmed', email: 'sara.ahmed@email.com', phone: '+963-11-2345678' },
      { name: 'Omar Hassan', email: 'omar.hassan@email.com', phone: '+963-11-3456789' },
      { name: 'Layla Ibrahim', email: 'layla.ibrahim@email.com', phone: '+963-11-4567890' },
      { name: 'Khalid Mahmoud', email: 'khalid.mahmoud@email.com', phone: '+963-11-5678901' }
    ];

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const agent = agents.find(a => a.fullName === listing.agent);
      if (agent && Math.random() > 0.3) { // 70% of listings have messages
        const sender = messageSenders[Math.floor(Math.random() * messageSenders.length)];
        const message = new Message({
          propertyId: listing._id,
          agentId: agent._id,
          senderName: sender.name,
          senderEmail: sender.email,
          senderPhone: sender.phone,
          subject: messageSubjects[Math.floor(Math.random() * messageSubjects.length)],
          message: messageBodies[Math.floor(Math.random() * messageBodies.length)],
          status: Math.random() > 0.5 ? 'read' : 'unread',
          messageType: 'inquiry'
        });
        await message.save();
        messagesCreated.push(message);
      }
    }
    console.log(`✅ Created ${messagesCreated.length} messages\n`);

    // Create favorites
    console.log('❤️  Creating favorites...');
    // First, create a test user for favorites
    let testUser = await User.findOne({ email: 'testuser@syrianproperties.com' });
    if (!testUser) {
      testUser = new User({
        username: 'testuser',
        email: 'testuser@syrianproperties.com',
        password: 'hashedpassword',
        role: 'user'
      });
      await testUser.save();
    }

    const favoritesCreated = [];
    for (let i = 0; i < listings.length; i++) {
      if (Math.random() > 0.7) { // 30% of listings are favorited
        const favorite = new Favorite({
          userId: testUser._id,
          propertyId: listings[i]._id
        });
        await favorite.save();
        favoritesCreated.push(favorite);
      }
    }
    console.log(`✅ Created ${favoritesCreated.length} favorites\n`);

    // Display summary
    console.log('📊 Final Summary:');
    console.log(`   👨‍💼 Total Agents: ${await Agent.countDocuments()}`);
    console.log(`   🏠 Total Listings: ${await Listing.countDocuments()}`);
    console.log(`   ⭐ Total Reviews: ${await Review.countDocuments()}`);
    console.log(`   📧 Total Messages: ${await Message.countDocuments()}`);
    console.log(`   ❤️  Total Favorites: ${await Favorite.countDocuments()}`);
    
    console.log(`\n🏠 Listings by Type:`);
    const listingsByType = await Listing.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    listingsByType.forEach(type => {
      console.log(`   📍 ${type._id}: ${type.count}`);
    });

    console.log(`\n🏙️  Listings by City:`);
    const listingsByCity = await Listing.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    listingsByCity.forEach(city => {
      console.log(`   📍 ${city._id}: ${city.count}`);
    });

    console.log('\n✅ Comprehensive database created successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating comprehensive database:', error);
    process.exit(1);
  }
};

addComprehensiveData();
