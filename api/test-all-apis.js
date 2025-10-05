// Comprehensive API Testing Script
// This tests all backend API endpoints

const testAllAPIs = async () => {
  console.log('🚀 Starting Comprehensive API Testing...\n');
  
  const baseURL = 'http://localhost:5500/api';
  
  // Test data
  const testData = {
    user: {
      username: 'testuser_' + Date.now(),
      email: 'test_' + Date.now() + '@example.com',
      password: 'testpassword123'
    },
    agent: {
      name: 'Test Agent',
      email: 'agent@test.com',
      phone: '+1234567890',
      specialization: 'Residential',
      experience: '5 years',
      bio: 'Test agent bio'
    },
    contact: {
      name: 'Test Contact',
      email: 'contact@test.com',
      subject: 'Test Subject',
      message: 'Test message content'
    },
    listing: {
      propertyType: 'apartment',
      propertyKeyword: 'Test Property',
      propertyDesc: 'Test property description',
      propertyPrice: 150000,
      status: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      furnished: true,
      garages: true,
      address: '123 Test Street',
      country: 'Test Country',
      state: 'Test State',
      neighborhood: 'Test Neighborhood',
      agent: 'test-agent-123'
    },
    review: {
      propertyId: 'test-property-id',
      agentId: 'test-agent-id',
      rating: 5,
      comment: 'Test review comment'
    },
    favorite: {
      propertyId: 'test-property-id'
    },
    points: {
      amount: 1000,
      paymentMethod: 'credit_card',
      paymentReference: 'txn_test_123'
    }
  };

  // Helper function to make API calls
  const apiCall = async (method, endpoint, data = null) => {
    try {
      const url = `${baseURL}${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, options);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Test Authentication APIs
  console.log('=== Testing Authentication APIs ===');
  
  const authTests = [
    {
      name: 'POST /auth/signup',
      test: () => apiCall('POST', '/auth/signup', testData.user),
      expectedStatus: 201
    },
    {
      name: 'POST /auth/signin',
      test: () => apiCall('POST', '/auth/signin', {
        email: testData.user.email,
        password: testData.user.password
      }),
      expectedStatus: 200
    },
    {
      name: 'GET /auth/signout',
      test: () => apiCall('GET', '/auth/signout'),
      expectedStatus: 200
    }
  ];

  for (const test of authTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Agent APIs
  console.log('\n=== Testing Agent APIs ===');
  
  const agentTests = [
    {
      name: 'GET /agents',
      test: () => apiCall('GET', '/agents'),
      expectedStatus: 200
    },
    {
      name: 'POST /agents/create',
      test: () => apiCall('POST', '/agents/create', testData.agent),
      expectedStatus: 201
    }
  ];

  for (const test of agentTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Contact APIs
  console.log('\n=== Testing Contact APIs ===');
  
  const contactTests = [
    {
      name: 'POST /contacts/contact',
      test: () => apiCall('POST', '/contacts/contact', testData.contact),
      expectedStatus: 201
    },
    {
      name: 'GET /contacts',
      test: () => apiCall('GET', '/contacts'),
      expectedStatus: 200
    }
  ];

  for (const test of contactTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Listing APIs
  console.log('\n=== Testing Listing APIs ===');
  
  const listingTests = [
    {
      name: 'GET /listing/search',
      test: () => apiCall('GET', '/listing/search'),
      expectedStatus: 200
    },
    {
      name: 'GET /listing/stateCount',
      test: () => apiCall('GET', '/listing/stateCount'),
      expectedStatus: 200
    },
    {
      name: 'POST /listing/create',
      test: () => apiCall('POST', '/listing/create', testData.listing),
      expectedStatus: 201
    }
  ];

  for (const test of listingTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Review APIs
  console.log('\n=== Testing Review APIs ===');
  
  const reviewTests = [
    {
      name: 'GET /review',
      test: () => apiCall('GET', '/review'),
      expectedStatus: 200
    },
    {
      name: 'POST /review',
      test: () => apiCall('POST', '/review', testData.review),
      expectedStatus: 201
    },
    {
      name: 'GET /review/property/test-property-id',
      test: () => apiCall('GET', '/review/property/test-property-id'),
      expectedStatus: 200
    },
    {
      name: 'GET /review/agent/test-agent-id',
      test: () => apiCall('GET', '/review/agent/test-agent-id'),
      expectedStatus: 200
    }
  ];

  for (const test of reviewTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Point APIs (these require authentication)
  console.log('\n=== Testing Point APIs ===');
  
  const pointTests = [
    {
      name: 'GET /points/balance',
      test: () => apiCall('GET', '/points/balance'),
      expectedStatus: 401 // Should require authentication
    },
    {
      name: 'POST /points/calculate-cost',
      test: () => apiCall('POST', '/points/calculate-cost', {
        propertyType: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        amenities: ['parking'],
        images: ['img1.jpg']
      }),
      expectedStatus: 401 // Should require authentication
    }
  ];

  for (const test of pointTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  // Test Favorite APIs (these require authentication)
  console.log('\n=== Testing Favorite APIs ===');
  
  const favoriteTests = [
    {
      name: 'GET /favorites',
      test: () => apiCall('GET', '/favorites'),
      expectedStatus: 401 // Should require authentication
    },
    {
      name: 'POST /favorites',
      test: () => apiCall('POST', '/favorites', testData.favorite),
      expectedStatus: 401 // Should require authentication
    }
  ];

  for (const test of favoriteTests) {
    const result = await test.test();
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${test.name} - Status: ${result.status || 'Error'}`);
  }

  console.log('\n🎉 API Testing Completed!');
  console.log('\n📋 Test Summary:');
  console.log('✅ Authentication endpoints tested');
  console.log('✅ Agent endpoints tested');
  console.log('✅ Contact endpoints tested');
  console.log('✅ Listing endpoints tested');
  console.log('✅ Review endpoints tested');
  console.log('✅ Point endpoints tested (authentication required)');
  console.log('✅ Favorite endpoints tested (authentication required)');
  
  console.log('\n🔐 Note: Some endpoints require authentication and will return 401 status');
  console.log('📝 This is expected behavior for protected routes');
};

// Run the tests
testAllAPIs().catch(console.error);
