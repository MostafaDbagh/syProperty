const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
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

// Mock Data Generators
const generateUsers = async () => {
  const hashedPassword = bcryptjs.hashSync('password123', 10);
  
  const users = [
    // Agents
    {
      username: 'john_agent',
      email: 'john@agent.com',
      password: hashedPassword,
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=1',
      pointsBalance: 100,
      packageType: 'premium'
    },
    {
      username: 'sarah_realtor',
      email: 'sarah@realtor.com',
      password: hashedPassword,
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=2',
      pointsBalance: 150,
      packageType: 'enterprise'
    },
    {
      username: 'mike_properties',
      email: 'mike@properties.com',
      password: hashedPassword,
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=3',
      pointsBalance: 80,
      packageType: 'basic'
    },
    {
      username: 'emma_homes',
      email: 'emma@homes.com',
      password: hashedPassword,
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=4',
      pointsBalance: 120,
      packageType: 'premium'
    },
    {
      username: 'david_estates',
      email: 'david@estates.com',
      password: hashedPassword,
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=5',
      pointsBalance: 90,
      packageType: 'basic'
    },
    // Regular Users
    {
      username: 'alice_buyer',
      email: 'alice@buyer.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=6',
      pointsBalance: 0,
      packageType: 'basic'
    },
    {
      username: 'bob_renter',
      email: 'bob@renter.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=7',
      pointsBalance: 0,
      packageType: 'basic'
    },
    {
      username: 'charlie_investor',
      email: 'charlie@investor.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=8',
      pointsBalance: 0,
      packageType: 'basic'
    },
    {
      username: 'diana_seeker',
      email: 'diana@seeker.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=9',
      pointsBalance: 0,
      packageType: 'basic'
    },
    {
      username: 'evan_client',
      email: 'evan@client.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=10',
      pointsBalance: 0,
      packageType: 'basic'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

const generateListings = async (users) => {
  // Get agent users
  const agents = users.filter(u => u.role === 'agent');
  const johnAgent = agents.find(a => a.email === 'john@agent.com');
  
  const propertyTypes = ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Studio', 'Penthouse', 'Duplex'];
  const statuses = ['sale', 'rent'];
  const approvalStatuses = ['pending', 'approved', 'closed'];
  const countries = ['USA', 'Canada', 'UK', 'Australia'];
  const states = ['California', 'New York', 'Texas', 'Florida', 'Ontario', 'London', 'Washington', 'Nevada'];
  const neighborhoods = ['Downtown', 'Suburb', 'Waterfront', 'Hillside', 'City Center', 'Lakeside'];
  
  const listings = [];
  
  // Generate 25 properties for John (to test pagination)
  console.log(`📝 Generating 25 properties for John...`);
  for (let i = 0; i < 25; i++) {
    const status = statuses[i % 2];
    const approvalStatus = approvalStatuses[i % 3];
    const propertyType = propertyTypes[i % propertyTypes.length];
    const state = states[i % states.length];
    const neighborhood = neighborhoods[i % neighborhoods.length];
    
    listings.push({
      propertyId: `JOHN-PROP-${1000 + i}`,
      propertyType: propertyType,
      propertyKeyword: `${propertyType} in ${neighborhood} ${state}`,
      propertyDesc: `Stunning ${propertyType.toLowerCase()} located in the heart of ${neighborhood} ${state}. This property features modern amenities, spacious rooms, and excellent connectivity to major landmarks. Perfect for ${status === 'sale' ? 'buyers looking for a dream home' : 'tenants seeking premium accommodation'}.`,
      propertyPrice: status === 'sale' ? 250000 + (i * 50000) : 1500 + (i * 200),
      status: status,
      rentType: status === 'rent' ? ['monthly', 'yearly', 'weekly'][i % 3] : undefined,
      bedrooms: 2 + (i % 4),
      bathrooms: 1 + (i % 3),
      size: 800 + (i * 150),
      landArea: status === 'sale' ? 1500 + (i * 300) : undefined,
      furnished: i % 2 === 0,
      garages: i % 3 === 0,
      garageSize: i % 3 === 0 ? 250 + (i * 15) : undefined,
      yearBuilt: 2000 + (i % 23),
      amenities: ['Parking', 'Garden', 'Pool', 'Gym', 'Security', '24/7 Water', 'Elevator', 'Balcony'].slice(0, (i % 6) + 2),
      address: `${200 + i} ${['Oak', 'Main', 'Elm', 'Park', 'Lake'][i % 5]} Street, ${state}`,
      country: countries[i % countries.length],
      state: state,
      neighborhood: `${neighborhood} ${state}`,
      agent: johnAgent.email,
      agentId: johnAgent._id,
      approvalStatus: approvalStatus,
      isSold: approvalStatus === 'closed' && i % 5 === 0,
      isDeleted: false,
      offer: i % 5 === 0,
      videoUrl: i % 7 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
      images: [
        {
          url: `https://picsum.photos/800/600?random=${100 + i * 3}`,
          publicId: `john_property_${i}_1`,
          filename: `john_property_${i}_1.jpg`
        },
        {
          url: `https://picsum.photos/800/600?random=${100 + i * 3 + 1}`,
          publicId: `john_property_${i}_2`,
          filename: `john_property_${i}_2.jpg`
        },
        {
          url: `https://picsum.photos/800/600?random=${100 + i * 3 + 2}`,
          publicId: `john_property_${i}_3`,
          filename: `john_property_${i}_3.jpg`
        }
      ],
      imageNames: [`john_property_${i}_1.jpg`, `john_property_${i}_2.jpg`, `john_property_${i}_3.jpg`]
    });
  }
  
  // Generate 5 properties for each other agent
  console.log(`📝 Generating 5 properties for other agents...`);
  const otherAgents = agents.filter(a => a.email !== 'john@agent.com');
  otherAgents.forEach((agent, agentIndex) => {
    for (let i = 0; i < 5; i++) {
      const propertyIndex = 100 + (agentIndex * 5) + i;
      const status = statuses[i % 2];
      const propertyType = propertyTypes[i % propertyTypes.length];
      const state = states[i % states.length];
      
      listings.push({
        propertyId: `PROP-${propertyIndex}`,
        propertyType: propertyType,
        propertyKeyword: `${propertyType} in ${state}`,
        propertyDesc: `Beautiful ${propertyType.toLowerCase()} with modern amenities and great location. Perfect for families or young professionals.`,
        propertyPrice: status === 'sale' ? 200000 + (i * 30000) : 1200 + (i * 150),
        status: status,
        rentType: status === 'rent' ? ['monthly', 'yearly', 'weekly'][i % 3] : undefined,
        bedrooms: 1 + (i % 5),
        bathrooms: 1 + (i % 3),
        size: 600 + (i * 100),
        landArea: status === 'sale' ? 1200 + (i * 200) : undefined,
        furnished: i % 2 === 0,
        garages: i % 3 === 0,
        garageSize: i % 3 === 0 ? 200 + (i * 10) : undefined,
        yearBuilt: 1995 + (i % 28),
        amenities: ['Parking', 'Garden', 'Pool', 'Gym', 'Security'].slice(0, (i % 5) + 1),
        address: `${300 + i} Main Street, ${state}`,
        country: countries[i % countries.length],
        state: state,
        neighborhood: `Downtown ${state}`,
        agent: agent.email,
        agentId: agent._id,
        approvalStatus: 'approved',
        isSold: false,
        isDeleted: false,
        offer: i % 4 === 0,
        videoUrl: i % 5 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
        images: [
          {
            url: `https://picsum.photos/800/600?random=${propertyIndex * 3}`,
            publicId: `property_${propertyIndex}_1`,
            filename: `property_${propertyIndex}_1.jpg`
          },
          {
            url: `https://picsum.photos/800/600?random=${propertyIndex * 3 + 1}`,
            publicId: `property_${propertyIndex}_2`,
            filename: `property_${propertyIndex}_2.jpg`
          },
          {
            url: `https://picsum.photos/800/600?random=${propertyIndex * 3 + 2}`,
            publicId: `property_${propertyIndex}_3`,
            filename: `property_${propertyIndex}_3.jpg`
          }
        ],
        imageNames: [`property_${propertyIndex}_1.jpg`, `property_${propertyIndex}_2.jpg`, `property_${propertyIndex}_3.jpg`]
      });
    }
  });

  const createdListings = await Listing.insertMany(listings);
  console.log(`✅ Created ${createdListings.length} listings (${listings.filter(l => l.agent === johnAgent.email).length} for John)`);
  return createdListings;
};

const generateReviews = async (users, listings) => {
  const regularUsers = users.filter(u => u.role === 'user');
  const reviews = [];
  
  // Find John's listings (first 25 listings are John's)
  const johnListings = listings.slice(0, 25);
  
  const reviewTexts = [
    'Great property! Very spacious and well-maintained.',
    'Perfect location, close to schools and shopping centers.',
    'The agent was very helpful and professional throughout the process.',
    'Beautiful interior design and modern amenities. Highly recommended!',
    'Highly recommend this property for families looking for comfort.',
    'Excellent value for money. Very satisfied with the purchase.',
    'Clean and well-kept. The neighborhood is quiet and safe.',
    'Amazing views and great natural lighting throughout the house.',
    'The property exceeded our expectations in every way possible.',
    'Professional service from start to finish. Great experience!',
    'Love the location and the property itself is stunning.',
    'Modern fixtures and finishes. Everything is brand new.',
    'Great investment opportunity. Property value is increasing.',
    'Spacious rooms and excellent layout. Perfect for our family.',
    'The neighborhood is fantastic with great amenities nearby.',
    'Wonderful property with all the features we were looking for.',
    'The agent John was extremely helpful and knowledgeable.',
    'Beautiful landscaping and well-maintained exterior.',
    'Great property for the price. Would definitely recommend.',
    'Excellent communication from the agent. Very professional.',
    'The property photos don\'t do it justice. It\'s even better in person!',
    'Very happy with our purchase. The process was smooth and easy.',
    'Great location near schools, parks, and shopping centers.',
    'The property is exactly as described. No surprises.',
    'Highly satisfied with the entire buying experience.',
    'Beautiful home with lots of natural light and modern upgrades.',
    'The property is in excellent condition. Move-in ready!',
    'Great neighborhood with friendly neighbors and low crime.',
    'Perfect size for our growing family. Plenty of space.',
    'Love the open floor plan and modern kitchen.'
  ];
  
  const reviewerNames = [
    'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis',
    'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Ivy Taylor', 'Jack Anderson',
    'Kate Thomas', 'Leo Jackson', 'Mia White', 'Noah Harris', 'Olivia Martin',
    'Paul Thompson', 'Quinn Garcia', 'Rachel Martinez', 'Sam Robinson', 'Tina Clark',
    'Uma Rodriguez', 'Victor Lewis', 'Wendy Lee', 'Xavier Walker', 'Yara Hall',
    'Zane Allen', 'Amy Young', 'Brian King', 'Cathy Wright', 'Derek Lopez'
  ];
  
  // Generate 30 reviews for John's properties (mix across different properties)
  console.log(`📝 Generating 30 reviews for John's properties...`);
  for (let i = 0; i < 30; i++) {
    const user = regularUsers[i % regularUsers.length];
    const listing = johnListings[i % johnListings.length];
    const reviewerName = reviewerNames[i % reviewerNames.length];
    
    reviews.push({
      propertyId: listing._id.toString(),
      userId: user._id,
      name: reviewerName,
      email: `${reviewerName.toLowerCase().replace(' ', '.')}${i}@example.com`, // Unique email
      review: reviewTexts[i % reviewTexts.length],
      rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
      likes: Math.floor(Math.random() * 50),
      dislikes: Math.floor(Math.random() * 10)
    });
  }

  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${createdReviews.length} reviews for John's properties`);
  return createdReviews;
};

const generateFavorites = async (users, listings) => {
  const regularUsers = users.filter(u => u.role === 'user');
  const agents = users.filter(u => u.role === 'agent');
  const johnAgent = agents.find(a => a.email === 'john@agent.com');
  
  const favorites = [];
  const favoriteSet = new Set(); // To track unique combinations
  
  // Generate 30 favorites for regular users
  console.log(`📝 Generating 30 favorites for regular users...`);
  for (let i = 0; i < 30; i++) {
    const user = regularUsers[i % regularUsers.length];
    const listing = listings[i % listings.length];
    const key = `${user._id}-${listing._id}`;
    
    if (!favoriteSet.has(key)) {
      favoriteSet.add(key);
      favorites.push({
        userId: user._id,
        propertyId: listing._id
      });
    }
  }
  
  // Generate 15 favorites for John (agents can also have favorites)
  console.log(`📝 Generating 15 favorites for John (agent)...`);
  for (let i = 0; i < 15; i++) {
    // John favorites properties from other agents or his own
    const listing = listings[(i + 5) % listings.length]; // Skip some to vary selection
    const key = `${johnAgent._id}-${listing._id}`;
    
    if (!favoriteSet.has(key)) {
      favoriteSet.add(key);
      favorites.push({
        userId: johnAgent._id,
        propertyId: listing._id
      });
    }
  }
  
  // Generate 5 favorites for other agents
  console.log(`📝 Generating 5 favorites for other agents...`);
  const otherAgents = agents.filter(a => a.email !== 'john@agent.com');
  for (let i = 0; i < 5; i++) {
    const agent = otherAgents[i % otherAgents.length];
    const listing = listings[(i + 10) % listings.length];
    const key = `${agent._id}-${listing._id}`;
    
    if (!favoriteSet.has(key)) {
      favoriteSet.add(key);
      favorites.push({
        userId: agent._id,
        propertyId: listing._id
      });
    }
  }

  const createdFavorites = await Favorite.insertMany(favorites);
  console.log(`✅ Created ${createdFavorites.length} favorites (${favorites.filter(f => f.userId.toString() === johnAgent._id.toString()).length} for John)`);
  return createdFavorites;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Generate mock data
    console.log('📝 Generating mock data...\n');
    
    const users = await generateUsers();
    const listings = await generateListings(users);
    const reviews = await generateReviews(users, listings);
    const favorites = await generateFavorites(users, listings);

    // Summary
    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length} (${users.filter(u => u.role === 'agent').length} agents, ${users.filter(u => u.role === 'user').length} regular users)`);
    console.log(`   🏠 Listings: ${listings.length}`);
    
    // John's property breakdown
    const johnListings = listings.filter(l => l.agent === 'john@agent.com');
    const johnPending = johnListings.filter(l => l.approvalStatus === 'pending').length;
    const johnApproved = johnListings.filter(l => l.approvalStatus === 'approved').length;
    const johnClosed = johnListings.filter(l => l.approvalStatus === 'closed').length;
    const johnForSale = johnListings.filter(l => l.status === 'sale').length;
    const johnForRent = johnListings.filter(l => l.status === 'rent').length;
    
    console.log(`\n   🏘️  John's Properties (${johnListings.length} total):`);
    console.log(`      - Pending: ${johnPending}`);
    console.log(`      - Approved: ${johnApproved}`);
    console.log(`      - Closed: ${johnClosed}`);
    console.log(`      - For Sale: ${johnForSale}`);
    console.log(`      - For Rent: ${johnForRent}`);
    
    console.log(`\n   ⭐ Reviews: ${reviews.length}`);
    console.log(`   ❤️  Favorites: ${favorites.length}\n`);

    console.log('🔐 Login Credentials:');
    console.log('   All users password: password123\n');
    
    console.log('👨‍💼 Agent Accounts:');
    users.filter(u => u.role === 'agent').forEach(user => {
      console.log(`   📧 ${user.email} (${user.username})`);
    });
    
    console.log('\n👤 Regular User Accounts:');
    users.filter(u => u.role === 'user').forEach(user => {
      console.log(`   📧 ${user.email} (${user.username})`);
    });

    console.log('\n✅ You can now test agent data filtering!');
    console.log('   - Login as any agent to see their listings');
    console.log('   - Check My Properties page');
    console.log('   - View reviews for agent properties');
    console.log('   - See user favorites\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();

