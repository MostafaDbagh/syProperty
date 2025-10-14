#!/bin/bash

# Quick test to verify pending listings count for khaledaljendi@gmail.com

BASE_URL="https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api"

echo "🔍 Testing Dashboard API - Pending Listings Count"
echo "================================================"

# 1. Login to get token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "khaledaljendi@gmail.com",
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

# 2. Test dashboard stats
echo -e "\n2. Testing dashboard stats..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Dashboard response: $DASHBOARD_RESPONSE"

# Extract pending count
PENDING_COUNT=$(echo "$DASHBOARD_RESPONSE" | grep -o '"pendingListings":[0-9]*' | cut -d':' -f2)

echo -e "\n📊 Results:"
echo "Pending Listings Count: $PENDING_COUNT"

if [ "$PENDING_COUNT" = "5" ]; then
  echo "✅ SUCCESS: Pending count is correct (5)"
else
  echo "❌ ISSUE: Expected 5, got $PENDING_COUNT"
fi

echo -e "\n🔍 Direct database check..."
# 3. Check database directly
DB_CHECK=$(curl -s -X GET "$BASE_URL/listing/search?agentId=68e930500c59b3e3fedcf1a3&approvalStatus=pending" \
  -H "Authorization: Bearer $TOKEN")

echo "Direct DB check: $DB_CHECK"

echo -e "\n✅ Test completed!"
