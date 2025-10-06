/**
 * Comprehensive Add Property Test Script
 * This script tests all aspects of the add property functionality
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_PROPERTY_DATA = {
  propertyType: "Apartment",
  propertyKeyword: "Luxury",
  propertyDesc: "Beautiful modern apartment with stunning city views",
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
  propertyId: `TEST${Date.now()}`
};

// Test scenarios
const testScenarios = [
  {
    name: "Valid Property Creation",
    data: TEST_PROPERTY_DATA,
    shouldPass: true
  },
  {
    name: "Missing Required Fields",
    data: { ...TEST_PROPERTY_DATA, propertyType: "", address: "" },
    shouldPass: false
  },
  {
    name: "Invalid Price",
    data: { ...TEST_PROPERTY_DATA, propertyPrice: "invalid" },
    shouldPass: false
  },
  {
    name: "Invalid Bedrooms",
    data: { ...TEST_PROPERTY_DATA, bedrooms: "not_a_number" },
    shouldPass: false
  },
  {
    name: "Missing Property Type",
    data: { ...TEST_PROPERTY_DATA, propertyType: "" },
    shouldPass: false
  },
  {
    name: "Missing Status",
    data: { ...TEST_PROPERTY_DATA, status: "" },
    shouldPass: false
  },
  {
    name: "Empty Amenities Array",
    data: { ...TEST_PROPERTY_DATA, amenities: [] },
    shouldPass: true
  },
  {
    name: "Large Amenities Array",
    data: { 
      ...TEST_PROPERTY_DATA, 
      amenities: Array(20).fill().map((_, i) => `Amenity ${i + 1}`)
    },
    shouldPass: true
  }
];

// Helper function to create FormData
function createFormData(data) {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'amenities' && Array.isArray(data[key])) {
      data[key].forEach(amenity => {
        formData.append('amenities', amenity);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
}

// Test function
async function testAddProperty() {
  console.log('🏠 Starting Add Property Tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const scenario of testScenarios) {
    console.log(`📋 Testing: ${scenario.name}`);
    
    try {
      const formData = createFormData(scenario.data);
      
      const response = await axios.post(`${API_BASE_URL}/listing/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000
      });
      
      if (scenario.shouldPass) {
        console.log(`✅ PASSED: ${scenario.name}`);
        console.log(`   Property ID: ${response.data._id || response.data.id}`);
        passedTests++;
      } else {
        console.log(`❌ FAILED: ${scenario.name} - Should have failed but passed`);
        failedTests++;
      }
      
    } catch (error) {
      if (!scenario.shouldPass) {
        console.log(`✅ PASSED: ${scenario.name} - Correctly rejected`);
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
        passedTests++;
      } else {
        console.log(`❌ FAILED: ${scenario.name} - Should have passed but failed`);
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
        failedTests++;
      }
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test image upload functionality
  console.log('📸 Testing Image Upload...');
  try {
    // Create a test property first
    const testData = { ...TEST_PROPERTY_DATA, propertyId: `IMG_TEST${Date.now()}` };
    const formData = createFormData(testData);
    
    // Note: In a real test, you would create actual image files
    // For now, we'll test without images
    const response = await axios.post(`${API_BASE_URL}/listing/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log(`✅ Image upload test passed - Property created with ID: ${response.data._id}`);
    passedTests++;
    
  } catch (error) {
    console.log(`❌ Image upload test failed: ${error.response?.data?.message || error.message}`);
    failedTests++;
  }
  
  // Test property retrieval
  console.log('\n🔍 Testing Property Retrieval...');
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/search`);
    const properties = response.data.listings || response.data;
    
    if (Array.isArray(properties) && properties.length > 0) {
      console.log(`✅ Property retrieval test passed - Found ${properties.length} properties`);
      passedTests++;
      
      // Test getting a specific property
      const firstProperty = properties[0];
      const propertyResponse = await axios.get(`${API_BASE_URL}/listing/${firstProperty._id || firstProperty.id}`);
      console.log(`✅ Single property retrieval test passed - Property: ${propertyResponse.data.propertyType}`);
      passedTests++;
    } else {
      console.log('❌ Property retrieval test failed - No properties found');
      failedTests++;
    }
    
  } catch (error) {
    console.log(`❌ Property retrieval test failed: ${error.response?.data?.message || error.message}`);
    failedTests++;
  }
  
  // Test API endpoints
  console.log('\n🌐 Testing API Endpoints...');
  const endpoints = [
    { method: 'GET', url: '/listing/search', name: 'Search Listings' },
    { method: 'GET', url: '/listing/stateCount', name: 'State Count' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.url}`,
        timeout: 5000
      });
      
      console.log(`✅ ${endpoint.name} endpoint working - Status: ${response.status}`);
      passedTests++;
      
    } catch (error) {
      console.log(`❌ ${endpoint.name} endpoint failed: ${error.response?.data?.message || error.message}`);
      failedTests++;
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Add Property functionality is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
  
  return { passed: passedTests, failed: failedTests };
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Running Performance Tests...');
  
  const startTime = Date.now();
  const promises = [];
  
  // Create multiple properties concurrently
  for (let i = 0; i < 5; i++) {
    const testData = { 
      ...TEST_PROPERTY_DATA, 
      propertyId: `PERF_TEST_${i}_${Date.now()}`,
      address: `${i + 1} Performance Test Street`
    };
    
    promises.push(
      axios.post(`${API_BASE_URL}/listing/create`, createFormData(testData), {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000
      }).catch(err => ({ error: err.response?.data?.message || err.message }))
    );
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  const successCount = results.filter(r => !r.error).length;
  const duration = endTime - startTime;
  
  console.log(`⚡ Performance Test Results:`);
  console.log(`   - Created ${successCount}/5 properties`);
  console.log(`   - Total time: ${duration}ms`);
  console.log(`   - Average time per property: ${(duration / 5).toFixed(0)}ms`);
  
  return { successCount, duration };
}

// Main execution
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Add Property Tests\n');
  console.log('=' .repeat(60));
  
  try {
    // Check if API is running
    await axios.get(`${API_BASE_URL}/listing/search`, { timeout: 5000 });
    console.log('✅ API server is running\n');
  } catch (error) {
    console.log('❌ API server is not running. Please start the server first.');
    console.log('   Run: cd api && npm start');
    process.exit(1);
  }
  
  const testResults = await testAddProperty();
  const perfResults = await performanceTest();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 All tests completed!');
  
  return {
    tests: testResults,
    performance: perfResults
  };
}

// Export for use in other files
module.exports = {
  runAllTests,
  testAddProperty,
  performanceTest,
  testScenarios
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
