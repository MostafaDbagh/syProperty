const axios = require('axios');

// Test the dashboard API directly
async function testDashboardAPI() {
  try {
    console.log('🧪 Testing Dashboard API...\n');
    
    // Test without authentication (should fail)
    console.log('1. Testing without authentication:');
    try {
      const response = await axios.get('https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api/api/dashboard/stats');
      console.log('❌ Should have failed but got:', response.status);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.response?.status || 'Network error');
    }
    
    // Test with authentication
    console.log('\n2. Testing with authentication:');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWUwOTY1YTBhMTQ0ZmM0ZDZlNjZjMiIsImVtYWlsIjoia2hhbGVkYWxqZW5kaUBnbWFpbC5jb20iLCJpYXQiOjE3NjA0MzA0ODEsImV4cCI6MTc2MTAzNTI4MX0.70Heov9J3EdWkI6UvcjBshlHFoH_0cDBjetS9N-W8OQ';
    
    try {
      const response = await axios.get('https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Dashboard API Response:');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      
      // Verify expected data structure
      const data = response.data;
      console.log('\n📊 Dashboard Data Verification:');
      console.log('Balance:', data.balance?.amount || 'Missing');
      console.log('Total Listings:', data.listings?.total || 'Missing');
      console.log('Pending Listings:', data.listings?.pending || 'Missing');
      console.log('Total Favorites:', data.favorites?.total || 'Missing');
      console.log('Total Reviews:', data.reviews?.total || 'Missing');
      console.log('Unread Messages:', data.messages?.unread || 'Missing');
      
    } catch (error) {
      console.log('❌ API call failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testDashboardAPI();
