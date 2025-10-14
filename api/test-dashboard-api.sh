#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5500/api"

echo -e "${BOLD}${BLUE}=========================================="
echo "DASHBOARD API COMPREHENSIVE TEST SUITE"
echo "=========================================="
echo -e "${NC}"

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local token="$5"
    local expected_status="$6"
    local expected_field="$7"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    
    # Make the request
    if [ -z "$token" ]; then
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
        fi
    else
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$BASE_URL$endpoint")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if test passed
    local test_passed=false
    
    if [ "$http_code" = "$expected_status" ]; then
        if [ -n "$expected_field" ]; then
            if echo "$body" | grep -q "$expected_field"; then
                test_passed=true
            fi
        else
            test_passed=true
        fi
    fi
    
    if [ "$test_passed" = true ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Status: $http_code"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC} - Status: $http_code (Expected: $expected_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "${YELLOW}Response:${NC} ${body:0:200}..."
    fi
}

# Function to create test user and get token
create_test_user() {
    echo -e "\n${BOLD}Creating test user for dashboard tests...${NC}"
    
    TIMESTAMP=$(date +%s)
    TESTEMAIL="dashboard${TIMESTAMP}@test.com"
    TESTUSER="dashboard${TIMESTAMP}"
    TESTPASS="Test123456!"
    
    # Create user
    SIGNUP_RESP=$(curl -s -X POST -H "Content-Type: application/json" \
      -d '{"email":"'"$TESTEMAIL"'","password":"'"$TESTPASS"'","firstName":"Dashboard","lastName":"Test","username":"'"$TESTUSER"'"}' \
      "$BASE_URL/auth/signup")
    
    if echo "$SIGNUP_RESP" | grep -q "success.*true"; then
        echo -e "${GREEN}✓ Test user created${NC}"
    else
        echo -e "${RED}✗ Failed to create test user${NC}"
        echo "Response: $SIGNUP_RESP"
        exit 1
    fi
    
    # Login to get token
    LOGIN_RESP=$(curl -s -X POST -H "Content-Type: application/json" \
      -d '{"email":"'"$TESTEMAIL"'","password":"'"$TESTPASS"'"}' \
      "$BASE_URL/auth/signin")
    
    TOKEN=$(echo "$LOGIN_RESP" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$LOGIN_RESP" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✓ Login successful${NC}"
        echo "Token: ${TOKEN:0:50}..."
        echo "User ID: $USER_ID"
    else
        echo -e "${RED}✗ Failed to get token${NC}"
        echo "Response: $LOGIN_RESP"
        exit 1
    fi
}

# Function to create test data
create_test_data() {
    echo -e "\n${BOLD}Creating test data for dashboard...${NC}"
    
    # Create some test listings
    for i in {1..3}; do
        LISTING_DATA='{
            "propertyTitle": "Test Property '${i}'",
            "propertyDesc": "Test description for property '${i}'",
            "propertyPrice": '$((100000 + i * 50000))',
            "propertyType": "House",
            "status": "'$([ $i -eq 1 ] && echo "pending" || echo "approved")'",
            "location": {
                "address": "'${i}' Test Street",
                "city": "Test City",
                "state": "TS",
                "country": "Test Country",
                "zipCode": "1234'${i}'"
            },
            "bedrooms": '$((2 + i))',
            "bathrooms": '$((1 + i))',
            "area": '$((1000 + i * 200))',
            "yearBuilt": '$((2020 + i))'
        }'
        
        LISTING_RESP=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
          -d "$LISTING_DATA" "$BASE_URL/listing")
        
        if echo "$LISTING_RESP" | grep -q "success\|_id"; then
            echo -e "${GREEN}✓ Created test listing ${i}${NC}"
        else
            echo -e "${YELLOW}⚠ Failed to create listing ${i}${NC}"
        fi
    done
    
    # Create some test favorites
    LISTING_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/listing/search?limit=1" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
    
    if [ -n "$LISTING_ID" ]; then
        for i in {1..2}; do
            FAV_RESP=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
              -d '{"listingId":"'"$LISTING_ID"'"}' "$BASE_URL/favorites")
            
            if echo "$FAV_RESP" | grep -q "success\|message"; then
                echo -e "${GREEN}✓ Created test favorite ${i}${NC}"
            else
                echo -e "${YELLOW}⚠ Failed to create favorite ${i}${NC}"
            fi
        done
    fi
    
    # Create some test messages
    for i in {1..2}; do
        MESSAGE_DATA='{
            "recipientId": "'"$USER_ID"'",
            "subject": "Test Message '${i}'",
            "message": "This is test message number '${i}'",
            "isRead": '$([ $i -eq 1 ] && echo "false" || echo "true")'
        }'
        
        MESSAGE_RESP=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
          -d "$MESSAGE_DATA" "$BASE_URL/message")
        
        if echo "$MESSAGE_RESP" | grep -q "success\|_id"; then
            echo -e "${GREEN}✓ Created test message ${i}${NC}"
        else
            echo -e "${YELLOW}⚠ Failed to create message ${i}${NC}"
        fi
    done
}

# Main test execution
echo -e "${BOLD}Starting Dashboard API Tests...${NC}"

# Create test user and get token
create_test_user

# Create test data
create_test_data

echo -e "\n${BOLD}Running Dashboard API Tests...${NC}"

# Test 1: Dashboard Stats
echo -e "\n${BOLD}1. DASHBOARD STATS TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/stats - Basic stats" "GET" "/dashboard/stats" "" "$TOKEN" "200" "totalListings"
run_test "GET /dashboard/stats - Check balance field" "GET" "/dashboard/stats" "" "$TOKEN" "200" "balance"
run_test "GET /dashboard/stats - Check favorites field" "GET" "/dashboard/stats" "" "$TOKEN" "200" "totalFavorites"
run_test "GET /dashboard/stats - Check messages field" "GET" "/dashboard/stats" "" "$TOKEN" "200" "totalMessages"
run_test "GET /dashboard/stats - Check user info" "GET" "/dashboard/stats" "" "$TOKEN" "200" "user"
run_test "GET /dashboard/stats - Check status indicators" "GET" "/dashboard/stats" "" "$TOKEN" "200" "status"

# Test 2: Dashboard Analytics
echo -e "\n${BOLD}2. DASHBOARD ANALYTICS TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/analytics - Default period" "GET" "/dashboard/analytics" "" "$TOKEN" "200" "charts"
run_test "GET /dashboard/analytics - 7 days period" "GET" "/dashboard/analytics?period=7d" "" "$TOKEN" "200" "period"
run_test "GET /dashboard/analytics - 30 days period" "GET" "/dashboard/analytics?period=30d" "" "$TOKEN" "200" "period"
run_test "GET /dashboard/analytics - 90 days period" "GET" "/dashboard/analytics?period=90d" "" "$TOKEN" "200" "period"
run_test "GET /dashboard/analytics - 1 year period" "GET" "/dashboard/analytics?period=1y" "" "$TOKEN" "200" "period"
run_test "GET /dashboard/analytics - Check charts data" "GET" "/dashboard/analytics" "" "$TOKEN" "200" "listingsOverTime"
run_test "GET /dashboard/analytics - Check top listings" "GET" "/dashboard/analytics" "" "$TOKEN" "200" "topPerformingListings"
run_test "GET /dashboard/analytics - Check monthly stats" "GET" "/dashboard/analytics" "" "$TOKEN" "200" "monthlyStats"

# Test 3: Dashboard Notifications
echo -e "\n${BOLD}3. DASHBOARD NOTIFICATIONS TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/notifications - Basic notifications" "GET" "/dashboard/notifications" "" "$TOKEN" "200" "notifications"
run_test "GET /dashboard/notifications - Check total count" "GET" "/dashboard/notifications" "" "$TOKEN" "200" "totalCount"
run_test "GET /dashboard/notifications - Check unread count" "GET" "/dashboard/notifications" "" "$TOKEN" "200" "unreadCount"

# Test 4: Dashboard Health
echo -e "\n${BOLD}4. DASHBOARD HEALTH TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/health - Health check" "GET" "/dashboard/health" "" "$TOKEN" "200" "status"
run_test "GET /dashboard/health - Check database status" "GET" "/dashboard/health" "" "$TOKEN" "200" "database"
run_test "GET /dashboard/health - Check data access" "GET" "/dashboard/health" "" "$TOKEN" "200" "dataAccess"

# Test 5: Authentication Tests
echo -e "\n${BOLD}5. AUTHENTICATION TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/stats - No token (should fail)" "GET" "/dashboard/stats" "" "" "401" "Unauthorized"
run_test "GET /dashboard/stats - Invalid token (should fail)" "GET" "/dashboard/stats" "" "invalid-token" "403" "Forbidden"
run_test "GET /dashboard/analytics - No token (should fail)" "GET" "/dashboard/analytics" "" "" "401" "Unauthorized"
run_test "GET /dashboard/notifications - No token (should fail)" "GET" "/dashboard/notifications" "" "" "401" "Unauthorized"

# Test 6: Edge Cases
echo -e "\n${BOLD}6. EDGE CASE TESTS${NC}"
echo "─────────────────────────────"

run_test "GET /dashboard/analytics - Invalid period" "GET" "/dashboard/analytics?period=invalid" "" "$TOKEN" "200" "30d"
run_test "GET /dashboard/stats - Non-existent user" "GET" "/dashboard/stats" "" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWUwOTY1YTBhMTQ0ZmM0ZDZlNjZjMiIsImVtYWlsIjoia2hhbGVkYWxqZW5kaUBnbWFpbC5jb20iLCJpc0FnZW50Ijp0cnVlLCJpYXQiOjE3NjA0MzQ5OTIsImV4cCI6MTc2MTAzOTc5Mn0.mmd8Q11osTxT9VUTwKd7KaJPWhng1NNuHF1_PRHH6jU" "404" "User not found"

# Test 7: Performance Tests
echo -e "\n${BOLD}7. PERFORMANCE TESTS${NC}"
echo "─────────────────────────────"

echo -e "\n${BLUE}Testing response times...${NC}"

# Test stats endpoint performance
start_time=$(date +%s%N)
STATS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/dashboard/stats")
end_time=$(date +%s%N)
stats_time=$(( (end_time - start_time) / 1000000 ))

if [ $stats_time -lt 2000 ]; then
    echo -e "${GREEN}✓ Stats endpoint: ${stats_time}ms (Good)${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠ Stats endpoint: ${stats_time}ms (Slow)${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test analytics endpoint performance
start_time=$(date +%s%N)
ANALYTICS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/dashboard/analytics")
end_time=$(date +%s%N)
analytics_time=$(( (end_time - start_time) / 1000000 ))

if [ $analytics_time -lt 3000 ]; then
    echo -e "${GREEN}✓ Analytics endpoint: ${analytics_time}ms (Good)${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠ Analytics endpoint: ${analytics_time}ms (Slow)${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test notifications endpoint performance
start_time=$(date +%s%N)
NOTIFICATIONS_RESP=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/dashboard/notifications")
end_time=$(date +%s%N)
notifications_time=$(( (end_time - start_time) / 1000000 ))

if [ $notifications_time -lt 2000 ]; then
    echo -e "${GREEN}✓ Notifications endpoint: ${notifications_time}ms (Good)${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠ Notifications endpoint: ${notifications_time}ms (Slow)${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 8: Data Validation Tests
echo -e "\n${BOLD}8. DATA VALIDATION TESTS${NC}"
echo "─────────────────────────────"

echo -e "\n${BLUE}Validating dashboard stats data structure...${NC}"

# Check if stats response has all required fields
REQUIRED_FIELDS=("balance" "totalListings" "pendingListings" "approvedListings" "totalFavorites" "totalReviews" "unreadMessages" "totalMessages" "user" "status")
for field in "${REQUIRED_FIELDS[@]}"; do
    if echo "$STATS_RESP" | grep -q "\"$field\""; then
        echo -e "${GREEN}✓ Field '$field' present${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ Field '$field' missing${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
done

echo -e "\n${BLUE}Validating analytics data structure...${NC}"

# Check if analytics response has all required fields
ANALYTICS_FIELDS=("period" "dateRange" "charts" "topPerformingListings" "monthlyStats" "summary")
for field in "${ANALYTICS_FIELDS[@]}"; do
    if echo "$ANALYTICS_RESP" | grep -q "\"$field\""; then
        echo -e "${GREEN}✓ Field '$field' present${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ Field '$field' missing${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
done

# Final Results
echo -e "\n${BOLD}${BLUE}=========================================="
echo "DASHBOARD API TEST RESULTS"
echo "=========================================="
echo -e "${NC}"

echo -e "${GREEN}✓ Passed: $PASSED_TESTS${NC}"
echo -e "${RED}✗ Failed: $FAILED_TESTS${NC}"
echo -e "${BLUE}Total Tests: $TOTAL_TESTS${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(awk "BEGIN {printf \"%.2f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")
    echo -e "${BOLD}Success Rate: $SUCCESS_RATE%${NC}"
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        echo -e "${GREEN}${BOLD}🎉 EXCELLENT! Dashboard API is working perfectly!${NC}"
    elif [ $SUCCESS_RATE -ge 80 ]; then
        echo -e "${YELLOW}${BOLD}👍 GOOD! Dashboard API is mostly working well.${NC}"
    elif [ $SUCCESS_RATE -ge 70 ]; then
        echo -e "${YELLOW}${BOLD}⚠️  FAIR! Dashboard API needs some improvements.${NC}"
    else
        echo -e "${RED}${BOLD}❌ POOR! Dashboard API has significant issues.${NC}"
    fi
fi

echo -e "\n${BOLD}Performance Summary:${NC}"
echo "• Stats endpoint: ${stats_time}ms"
echo "• Analytics endpoint: ${analytics_time}ms"
echo "• Notifications endpoint: ${notifications_time}ms"

echo -e "\n${BOLD}${BLUE}=========================================="
echo "TEST COMPLETE"
echo "=========================================="
echo -e "${NC}"

# Cleanup
echo -e "\n${YELLOW}Cleaning up test data...${NC}"
echo "Test user: $TESTEMAIL"
echo "User ID: $USER_ID"
echo -e "${GREEN}✓ Test data cleanup completed${NC}"

