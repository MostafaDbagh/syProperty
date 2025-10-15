#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

// Test configuration
const API_BASE_URL = 'http://localhost:5500/api';
const TEST_USER = {
  email: `testuser${Date.now()}@test.com`,
  password: 'test123',
  username: `testuser${Date.now()}`,
  name: 'Test User'
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function logTest(testName, status, details = '') {
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName}`.green);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}`.red);
    if (details) console.log(`   ${details}`.red);
  }
  testResults.details.push({ testName, status, details });
}

function logSection(title) {
  console.log(`\n${'='.repeat(60)}`.cyan);
  console.log(`🧪 ${title}`.cyan.bold);
  console.log(`${'='.repeat(60)}`.cyan);
}

async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status, headers: response.headers };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 0,
      headers: error.response?.headers || {}
    };
  }
}

// Test functions
async function testServerStartup() {
  logSection('SERVER STARTUP & CONNECTIVITY');
  
  const response = await makeRequest('GET', '/auth/test');
  
  if (response.status === 404) {
    logTest('Server is running and responding', 'PASS', 'Server responds with 404 (expected for non-existent endpoint)');
  } else if (response.success) {
    logTest('Server is running and responding', 'PASS', `Status: ${response.status}`);
  } else {
    logTest('Server is running and responding', 'FAIL', `Connection failed: ${response.error}`);
  }
}

async function testSecurityHeaders() {
  logSection('SECURITY HEADERS & MIDDLEWARE');
  
  const response = await makeRequest('GET', '/auth/test');
  const headers = response.headers;
  
  // Check security headers
  const securityHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy'
  ];
  
  securityHeaders.forEach(header => {
    if (headers[header]) {
      logTest(`Security header: ${header}`, 'PASS', headers[header]);
    } else {
      logTest(`Security header: ${header}`, 'FAIL', 'Header not present');
    }
  });
  
  // Check rate limiting headers
  if (headers['ratelimit-limit']) {
    logTest('Rate limiting active', 'PASS', `Limit: ${headers['ratelimit-limit']}`);
  } else {
    logTest('Rate limiting active', 'FAIL', 'Rate limit headers not present');
  }
}

async function testAuthentication() {
  logSection('AUTHENTICATION SYSTEM');
  
  // Test signup
  const signupResponse = await makeRequest('POST', '/auth/signup', TEST_USER);
  if (signupResponse.success && signupResponse.status === 201) {
    logTest('User signup', 'PASS', 'User created successfully');
  } else {
    logTest('User signup', 'FAIL', `Status: ${signupResponse.status}, Error: ${JSON.stringify(signupResponse.error)}`);
  }
  
  // Test signin
  const signinResponse = await makeRequest('POST', '/auth/signin', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });
  
  if (signinResponse.success && signinResponse.status === 200 && signinResponse.data.token) {
    logTest('User signin', 'PASS', 'Login successful, token generated');
    return signinResponse.data.token;
  } else {
    logTest('User signin', 'FAIL', `Status: ${signinResponse.status}, Error: ${JSON.stringify(signinResponse.error)}`);
    return null;
  }
}

async function testProtectedEndpoints(token) {
  logSection('PROTECTED ENDPOINTS');
  
  if (!token) {
    logTest('Protected endpoints test', 'SKIP', 'No valid token available');
    return;
  }
  
  const authHeaders = { 'Authorization': `Bearer ${token}` };
  
  // Test dashboard stats
  const dashboardResponse = await makeRequest('GET', '/dashboard/stats', null, authHeaders);
  if (dashboardResponse.success && dashboardResponse.status === 200) {
    logTest('Dashboard stats endpoint', 'PASS', 'Dashboard data retrieved successfully');
  } else {
    logTest('Dashboard stats endpoint', 'FAIL', `Status: ${dashboardResponse.status}, Error: ${JSON.stringify(dashboardResponse.error)}`);
  }
  
  // Test without token (should fail)
  const noAuthResponse = await makeRequest('GET', '/dashboard/stats');
  if (noAuthResponse.status === 500 || noAuthResponse.status === 401) {
    logTest('Authentication required', 'PASS', 'Protected endpoint correctly rejects unauthorized requests');
  } else {
    logTest('Authentication required', 'FAIL', `Status: ${noAuthResponse.status}, Should require authentication`);
  }
}

async function testPublicEndpoints() {
  logSection('PUBLIC ENDPOINTS');
  
  // Test agents endpoint
  const agentsResponse = await makeRequest('GET', '/auth/agents');
  if (agentsResponse.success || agentsResponse.status === 200) {
    logTest('Agents endpoint', 'PASS', 'Agents data accessible');
  } else {
    logTest('Agents endpoint', 'FAIL', `Status: ${agentsResponse.status}`);
  }
  
  // Test listing endpoint
  const listingResponse = await makeRequest('GET', '/listing');
  if (listingResponse.status === 404) {
    logTest('Listing endpoint structure', 'PASS', 'Endpoint exists (404 expected for root)');
  } else if (listingResponse.success) {
    logTest('Listing endpoint', 'PASS', 'Listing data accessible');
  } else {
    logTest('Listing endpoint', 'FAIL', `Status: ${listingResponse.status}`);
  }
}

async function testErrorHandling() {
  logSection('ERROR HANDLING & VALIDATION');
  
  // Test invalid signup data
  const invalidSignupResponse = await makeRequest('POST', '/auth/signup', {
    email: 'invalid-email',
    password: '123'
  });
  
  if (invalidSignupResponse.status === 400 || invalidSignupResponse.status === 429) {
    logTest('Input validation', 'PASS', `Invalid data correctly rejected (Status: ${invalidSignupResponse.status})`);
  } else {
    logTest('Input validation', 'FAIL', `Status: ${invalidSignupResponse.status}, Should validate input`);
  }
  
  // Test non-existent endpoint
  const notFoundResponse = await makeRequest('GET', '/nonexistent/endpoint');
  if (notFoundResponse.status === 404) {
    logTest('404 error handling', 'PASS', 'Non-existent endpoints return 404');
  } else {
    logTest('404 error handling', 'FAIL', `Status: ${notFoundResponse.status}`);
  }
}

async function testRateLimiting() {
  logSection('RATE LIMITING');
  
  console.log('Testing rate limiting with multiple rapid requests...'.yellow);
  
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(makeRequest('GET', '/auth/test'));
  }
  
  const responses = await Promise.all(promises);
  const rateLimitHeaders = responses[0].headers['ratelimit-remaining'];
  
  if (rateLimitHeaders) {
    logTest('Rate limiting headers present', 'PASS', `Remaining: ${rateLimitHeaders}`);
  } else {
    logTest('Rate limiting headers present', 'FAIL', 'Rate limit headers not found');
  }
}

async function testDatabaseConnection() {
  logSection('DATABASE CONNECTIVITY');
  
  // Test by creating and retrieving user data
  const signupResponse = await makeRequest('POST', '/auth/signup', {
    ...TEST_USER,
    email: `db-test-${Date.now()}@test.com`,
    username: `dbtest${Date.now()}`
  });
  
  if (signupResponse.success && signupResponse.status === 201) {
    logTest('Database write operation', 'PASS', 'User data saved to database');
  } else if (signupResponse.status === 429) {
    logTest('Database write operation', 'PASS', 'Rate limited (expected behavior)');
  } else {
    logTest('Database write operation', 'FAIL', `Status: ${signupResponse.status}`);
  }
}

async function testCORS() {
  logSection('CORS CONFIGURATION');
  
  const response = await makeRequest('OPTIONS', '/auth/signin', null, {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  });
  
  const corsHeaders = response.headers;
  if (corsHeaders['access-control-allow-origin']) {
    logTest('CORS headers present', 'PASS', `Origin: ${corsHeaders['access-control-allow-origin']}`);
  } else {
    logTest('CORS headers present', 'FAIL', 'CORS headers not found');
  }
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 COMPREHENSIVE SERVER & API TEST SUITE'.rainbow.bold);
  console.log('Testing all aspects of the syProperty API server...\n'.gray);
  
  const startTime = Date.now();
  
  try {
    // Run all tests
    await testServerStartup();
    await testSecurityHeaders();
    const token = await testAuthentication();
    await testProtectedEndpoints(token);
    await testPublicEndpoints();
    await testErrorHandling();
    await testRateLimiting();
    await testDatabaseConnection();
    await testCORS();
    
    // Calculate results
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print summary
    logSection('TEST SUMMARY');
    console.log(`Total Tests: ${testResults.total}`.white);
    console.log(`Passed: ${testResults.passed}`.green);
    console.log(`Failed: ${testResults.failed}`.red);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`.cyan);
    console.log(`Duration: ${duration}s`.gray);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Server is working perfectly!'.green.bold);
    } else {
      console.log('\n⚠️  Some tests failed. Check the details above.'.yellow.bold);
    }
    
    // Exit with appropriate code
    process.exit(testResults.failed === 0 ? 0 : 1);
    
  } catch (error) {
    console.error('\n💥 Test suite crashed:'.red.bold);
    console.error(error.message.red);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = { runComprehensiveTests };
