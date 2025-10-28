#!/usr/bin/env node
/**
 * Comprehensive Test Script for UserId vs AgentId
 * 
 * This script tests all API endpoints to ensure proper handling of userId and agentId
 */

require('dotenv').config();
const axios = require('axios');
const BASE_URL = 'http://localhost:5500';

// Test agents
const AGENT_USER = {
  email: 'hassan.ibrahim@syrianproperties.com',
  password: 'password123',
  userId: '68ff97d83bb30c2519e463ae',
  agentId: '68ff3cf6cbb96ae0f6c49518'
};

// Test regular user
const REGULAR_USER = {
  email: 'user@example.com',
  password: 'password123',
  userId: null // Will be set after signin
};

let agentToken = null;
let regularToken = null;

/**
 * Helper to make authenticated requests
 */
async function request(endpoint, method = 'GET', data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    if (data) config.data = data;
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      status: error.response?.status,
      data: error.response?.data 
    };
  }
}

/**
 * Sign in and get token
 */
async function signIn(email, password) {
  const result = await request('/api/auth/signin', 'POST', { email, password });
  if (result.success && result.data) {
    const token = result.data.token || result.data.access_token;
    return token;
  }
  return null;
}

/**
 * Test Results
 */
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(testName, passed, details = {}) {
  results.tests.push({ testName, passed, ...details });
  if (passed) {
    results.passed++;
    console.log(`✅ ${testName}`);
  } else {
    results.failed++;
    console.log(`❌ ${testName}`);
    console.log('   Details:', JSON.stringify(details, null, 2));
  }
}

/**
 * Run comprehensive tests
 */
async function runTests() {
  console.log('\n🧪 Starting Comprehensive API Tests...\n');
  console.log('=' .repeat(80));

  // Test 1: Sign in as agent
  console.log('\n📝 Test 1: Agent Authentication');
  agentToken = await signIn(AGENT_USER.email, AGENT_USER.password);
  logTest('Agent signin', agentToken !== null, { token: !!agentToken });

  // Test 2: Sign in as regular user
  console.log('\n📝 Test 2: Regular User Authentication');
  regularToken = await signIn(REGULAR_USER.email, REGULAR_USER.password);
  if (regularToken) {
    REGULAR_USER.userId = 'user-id-from-token'; // Extract from token if needed
    logTest('Regular user signin', true);
  } else {
    console.log('⚠️  Regular user not found, skipping some tests');
  }

  // Test 3: Dashboard Stats for Agent
  console.log('\n📝 Test 3: Dashboard Stats - Agent');
  const statsResult = await request('/api/dashboard/stats', 'GET', null, agentToken);
  const hasData = statsResult.success && statsResult.data?.data?.totalListings > 0;
  logTest('Dashboard stats API call', hasData, {
    success: statsResult.success,
    totalListings: statsResult.data?.data?.totalListings,
    totalReviews: statsResult.data?.data?.totalReviews,
    totalMessages: statsResult.data?.data?.totalMessages,
    hasData: hasData,
    status: statsResult.status,
    error: statsResult.error
  });

  // Test 4: Agent Listings
  console.log('\n📝 Test 4: Get Agent Listings');
  const listingsResult = await request(
    `/api/listing/agent/${AGENT_USER.userId}?page=1&limit=10`,
    'GET',
    null,
    agentToken
  );
  logTest('Agent listings API call', listingsResult.success, {
    success: listingsResult.success,
    totalListings: listingsResult.data?.pagination?.totalListings,
    foundListings: listingsResult.data?.data?.length,
    userId: AGENT_USER.userId
  });

  // Test 5: Agent Messages
  console.log('\n📝 Test 5: Get Agent Messages');
  const messagesResult = await request(
    `/api/message/agent/${AGENT_USER.userId}?page=1&limit=10`,
    'GET',
    null,
    agentToken
  );
  logTest('Agent messages API call', messagesResult.success, {
    success: messagesResult.success,
    totalMessages: messagesResult.data?.pagination?.totalMessages,
    foundMessages: messagesResult.data?.data?.length,
    userId: AGENT_USER.userId
  });

  // Test 6: Agent Reviews
  console.log('\n📝 Test 6: Get Agent Reviews');
  const reviewsResult = await request(
    `/api/review/agent/${AGENT_USER.userId}?page=1&limit=10`,
    'GET',
    null,
    agentToken
  );
  logTest('Agent reviews API call', reviewsResult.success, {
    success: reviewsResult.success,
    totalReviews: reviewsResult.data?.stats?.totalReviews,
    foundReviews: reviewsResult.data?.data?.length,
    userId: AGENT_USER.userId
  });

  // Test 7: Direct Agent ID Test
  console.log('\n📝 Test 7: Direct Agent ID Lookup');
  const directListingsResult = await request(
    `/api/listing/agent/${AGENT_USER.agentId}?page=1&limit=10`,
    'GET',
    null,
    agentToken
  );
  logTest('Direct agent ID listings', directListingsResult.success, {
    success: directListingsResult.success,
    totalListings: directListingsResult.data?.pagination?.totalListings,
    agentId: AGENT_USER.agentId
  });

  // Test 8: Dashboard Analytics
  console.log('\n📝 Test 8: Dashboard Analytics');
  const analyticsResult = await request(
    '/api/dashboard/analytics?period=30d',
    'GET',
    null,
    agentToken
  );
  logTest('Dashboard analytics API', analyticsResult.success, {
    success: analyticsResult.success,
    dataPoints: analyticsResult.data?.data?.charts?.listingsOverTime?.length
  });

  // Test 9: Dashboard Notifications
  console.log('\n📝 Test 9: Dashboard Notifications');
  const notificationsResult = await request(
    '/api/dashboard/notifications',
    'GET',
    null,
    agentToken
  );
  logTest('Dashboard notifications API', notificationsResult.success, {
    success: notificationsResult.success,
    notificationCount: notificationsResult.data?.data?.notifications?.length
  });

  // Test 10: Most Visited Listings
  console.log('\n📝 Test 10: Most Visited Listings');
  const visitedResult = await request(
    `/api/listing/agent/${AGENT_USER.userId}/mostVisited?limit=10`,
    'GET',
    null,
    agentToken
  );
  logTest('Most visited listings API', visitedResult.success, {
    success: visitedResult.success,
    foundListings: visitedResult.data?.data?.length,
    totalVisited: visitedResult.data?.pagination?.total
  });

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
  
  console.log('\n📋 DETAILED RESULTS:');
  console.log('='.repeat(80));
  results.tests.forEach((test, index) => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${index + 1}. ${test.testName}`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });

  console.log('\n' + '='.repeat(80));
  
  // Exit with error code if any tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

