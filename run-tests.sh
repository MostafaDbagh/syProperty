#!/bin/bash

# Comprehensive Test Runner for Add Property Functionality
# Usage: ./run-tests.sh

echo "🧪 Running Comprehensive Tests for Add Property..."
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Function to run tests
run_test() {
    local test_name=$1
    local test_file=$2
    
    echo -e "${YELLOW}Running: ${test_name}${NC}"
    
    if node "$test_file" 2>&1; then
        echo -e "${GREEN}✅ ${test_name} - PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ ${test_name} - FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
}

# Backend Tests
echo "📦 Backend Tests"
echo "----------------"
if [ -f "api/tests/addProperty.test.js" ]; then
    run_test "Backend Unit Tests" "api/tests/addProperty.test.js"
else
    echo -e "${RED}❌ Backend test file not found${NC}"
    ((FAILED++))
fi

# Frontend Tests
echo "🎨 Frontend Tests"
echo "-----------------"
if [ -f "proty-nextjs/tests/addProperty.test.js" ]; then
    run_test "Frontend Unit Tests" "proty-nextjs/tests/addProperty.test.js"
else
    echo -e "${RED}❌ Frontend test file not found${NC}"
    ((FAILED++))
fi

# Integration Tests
echo "🔗 Integration Tests"
echo "-------------------"
if [ -f "api/tests/integration/addProperty.integration.test.js" ]; then
    run_test "Integration Tests" "api/tests/integration/addProperty.integration.test.js"
else
    echo -e "${YELLOW}⚠️  Integration test file not found (optional)${NC}"
fi

# Summary
echo "=================================================="
echo "📊 Test Summary"
echo "=================================================="
echo -e "${GREEN}✅ Passed: ${PASSED}${NC}"
echo -e "${RED}❌ Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
    exit 1
fi

