#!/bin/bash

# Test script to verify pending listings fix

BASE_URL="https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api"

echo "🔍 Testing Dashboard API - Pending Listings Fix"
echo "=============================================="

# 1. Create a test user
echo "1. Creating test user..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "123456",
    "firstName": "Test",
    "lastName": "User",
    "isAgent": true
  }')

echo "Create response: $CREATE_RESPONSE"

# 2. Login to get token
echo -e "\n2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "123456"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token obtained: ${TOKEN:0:20}..."

# 3. Create some test listings with pending status
echo -e "\n3. Creating test listings..."
for i in {1..3}; do
  LISTING_RESPONSE=$(curl -s -X POST "$BASE_URL/listing/create" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"propertyType\": \"Apartment\",
      \"propertyKeyword\": \"Test Property $i\",
      \"propertyDesc\": \"Test description $i\",
      \"propertyPrice\": 100000,
      \"status\": \"rent\",
      \"rentType\": \"monthly\",
      \"bedrooms\": 2,
      \"bathrooms\": 1,
      \"size\": 1000,
      \"furnished\": false,
      \"garages\": false,
      \"address\": \"Test Address $i\",
      \"country\": \"Syria\",
      \"state\": \"Damascus\",
      \"neighborhood\": \"Test Area\",
      \"approvalStatus\": \"pending\"
    }")
  
  echo "Listing $i response: $LISTING_RESPONSE"
done

# 4. Test dashboard stats
echo -e "\n4. Testing dashboard stats..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Dashboard response: $DASHBOARD_RESPONSE"

# Extract pending count
PENDING_COUNT=$(echo "$DASHBOARD_RESPONSE" | grep -o '"pendingListings":[0-9]*' | cut -d':' -f2)

echo -e "\n📊 Results:"
echo "Pending Listings Count: $PENDING_COUNT"

if [ "$PENDING_COUNT" = "3" ]; then
  echo "✅ SUCCESS: Pending count is correct (3)"
else
  echo "❌ ISSUE: Expected 3, got $PENDING_COUNT"
fi

echo -e "\n✅ Test completed!"
