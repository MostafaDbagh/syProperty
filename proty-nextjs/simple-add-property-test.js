/**
 * Simple Add Property Test
 * Tests the core functionality without complex setup
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testBasicFunctionality() {
  console.log('🧪 Testing Basic Add Property Functionality...\n');
  
  // Test data
  const testProperty = {
    propertyType: "Apartment",
    propertyKeyword: "Luxury",
    propertyDesc: "Beautiful modern apartment for testing",
    propertyPrice: 250000,
    status: "rent",
    rentType: "monthly",
    bedrooms: 3,
    bathrooms: 2,
    size: 1200,
    landArea: 1500,
    furnished: true,
    garages: false,
    garageSize: null,
    yearBuilt: 2020,
    amenities: ["Shared Gym", "Smart Controls", "BBQ Area"],
    address: "123 Test Street, Test City",
    country: "United States",
    state: "California",
    neighborhood: "Downtown",
    agent: "agent007",
    propertyId: `TEST_${Date.now()}`
  };

  try {
    console.log('1. Testing API server connection...');
    const healthCheck = await axios.get(`${API_BASE_URL}/listing/search`, { timeout: 5000 });
    console.log('✅ API server is running');
    
    console.log('\n2. Testing property creation...');
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(testProperty).forEach(key => {
      if (key === 'amenities' && Array.isArray(testProperty[key])) {
        testProperty[key].forEach(amenity => {
          formData.append('amenities', amenity);
        });
      } else {
        formData.append(key, testProperty[key]);
      }
    });

    const createResponse = await axios.post(`${API_BASE_URL}/listing/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000
    });

    console.log('✅ Property created successfully!');
    console.log(`   Property ID: ${createResponse.data._id || createResponse.data.id}`);
    console.log(`   Property Type: ${createResponse.data.propertyType}`);
    console.log(`   Price: $${createResponse.data.propertyPrice}`);
    
    console.log('\n3. Testing property retrieval...');
    const propertyId = createResponse.data._id || createResponse.data.id;
    const getResponse = await axios.get(`${API_BASE_URL}/listing/${propertyId}`);
    
    console.log('✅ Property retrieved successfully!');
    console.log(`   Retrieved: ${getResponse.data.propertyType} - ${getResponse.data.address}`);
    
    console.log('\n4. Testing search functionality...');
    const searchResponse = await axios.get(`${API_BASE_URL}/listing/search`);
    const properties = searchResponse.data.listings || searchResponse.data;
    
    console.log(`✅ Search working - Found ${properties.length} total properties`);
    
    console.log('\n🎉 All tests passed! Add Property functionality is working correctly.');
    
    return {
      success: true,
      createdProperty: createResponse.data,
      totalProperties: properties.length
    };
    
  } catch (error) {
    console.log('❌ Test failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - API server is not running');
      console.log('   - Please start the server: cd api && npm run dev');
    } else if (error.response) {
      console.log(`   - HTTP ${error.response.status}: ${error.response.statusText}`);
      console.log(`   - Error: ${error.response.data?.message || error.response.data}`);
    } else {
      console.log(`   - Error: ${error.message}`);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testBasicFunctionality().then(result => {
  if (result.success) {
    console.log('\n📊 Test Results:');
    console.log(`   - Property created: ${result.createdProperty.propertyType}`);
    console.log(`   - Total properties in system: ${result.totalProperties}`);
    process.exit(0);
  } else {
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Start the API server: cd api && npm run dev');
    console.log('   3. Check if port 5000 is available');
    console.log('   4. Verify .env file has correct database connection string');
    process.exit(1);
  }
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
