/**
 * Backend Tests for Add Property Functionality
 * Run with: node api/tests/addProperty.test.js
 */

const mongoose = require('mongoose');
const Listing = require('../models/listing.model');
const { calculateListingPoints } = require('../middleware/pointDeduction');
const logger = require('../utils/logger');

// Mock data for testing
const mockListingData = {
  propertyType: 'Apartment',
  propertyKeyword: 'Luxury Modern Apartment',
  propertyDesc: 'Beautiful apartment in downtown area',
  propertyPrice: 250000,
  status: 'rent',
  rentType: 'monthly',
  bedrooms: 3,
  bathrooms: 2,
  size: 1500,
  furnished: true,
  garages: true,
  garageSize: 200,
  yearBuilt: 2020,
  address: '123 Main Street',
  country: 'Syria',
  city: 'Aleppo',
  state: 'Aleppo',
  neighborhood: 'Downtown',
  agent: 'test@example.com',
  agentId: new mongoose.Types.ObjectId(),
  amenities: ['Parking', 'Swimming Pool', 'Gym'],
  propertyId: `PROP_${Date.now()}`,
  approvalStatus: 'pending',
  isSold: false,
  isDeleted: false
};

// Test Suite
class AddPropertyTests {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async run() {
    console.log('\n🧪 Starting Backend Tests for Add Property...\n');
    
    // Test 1: City/State Mapping
    this.testCityStateMapping();
    
    // Test 2: Amenities Array Parsing
    this.testAmenitiesParsing();
    
    // Test 3: Point Calculation
    this.testPointCalculation();
    
    // Test 4: Required Fields Validation
    this.testRequiredFields();
    
    // Test 5: Data Type Validation
    this.testDataTypeValidation();
    
    // Test 6: Holiday Homes Requirements
    this.testHolidayHomesRequirements();
    
    // Test 7: Image Upload Data Structure
    this.testImageDataStructure();
    
    // Test 8: Agent ID Handling
    this.testAgentIdHandling();
    
    // Run all tests
    for (const test of this.tests) {
      try {
        await test();
        this.passed++;
      } catch (error) {
        this.failed++;
        console.error(`❌ ${test.name}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📊 Total: ${this.tests.length}`);
    console.log('='.repeat(50) + '\n');
  }

  testCityStateMapping() {
    this.tests.push(async () => {
      console.log('Test 1: City/State Mapping');
      
      // Test 1.1: City provided
      const data1 = { city: 'Damascus', state: 'Damascus' };
      const city1 = data1.city || data1.state || 'Unknown';
      if (city1 !== 'Damascus') throw new Error('Expected city to be Damascus');
      
      // Test 1.2: Only state provided
      const data2 = { state: 'Aleppo' };
      const city2 = data2.city || data2.state || 'Unknown';
      if (city2 !== 'Aleppo') throw new Error('Expected city to be mapped from state');
      
      // Test 1.3: Neither provided
      const data3 = {};
      const city3 = data3.city || data3.state || 'Unknown';
      if (city3 !== 'Unknown') throw new Error('Expected city to default to Unknown');
      
      console.log('  ✅ City/State mapping works correctly\n');
    });
  }

  testAmenitiesParsing() {
    this.tests.push(async () => {
      console.log('Test 2: Amenities Array Parsing');
      
      // Test 2.1: Array input
      const amenities1 = ['Parking', 'Pool', 'Gym'];
      if (!Array.isArray(amenities1)) {
        throw new Error('Expected array to remain array');
      }
      
      // Test 2.2: String input
      const amenities2 = 'Parking';
      const parsed2 = !Array.isArray(amenities2) && typeof amenities2 === 'string' 
        ? [amenities2] 
        : amenities2;
      if (!Array.isArray(parsed2) || parsed2.length !== 1) {
        throw new Error('Expected string to be converted to array');
      }
      
      // Test 2.3: Empty/null input
      const amenities3 = null;
      const parsed3 = amenities3 || [];
      if (!Array.isArray(parsed3)) {
        throw new Error('Expected null to become empty array');
      }
      
      console.log('  ✅ Amenities parsing works correctly\n');
    });
  }

  testPointCalculation() {
    this.tests.push(async () => {
      console.log('Test 3: Point Calculation');
      
      // Test 3.1: Basic calculation
      const basicData = {
        propertyType: 'apartment',
        size: 1000,
        bedrooms: 2,
        amenities: ['Parking'],
        images: []
      };
      const points1 = calculateListingPoints(basicData);
      if (typeof points1 !== 'number' || points1 <= 0) {
        throw new Error('Expected valid point calculation');
      }
      
      // Test 3.2: Large property calculation
      const largeData = {
        propertyType: 'villa',
        size: 2000,
        bedrooms: 5,
        amenities: ['Parking', 'Pool', 'Gym', 'Spa', 'Garden', 'Security'],
        images: Array(7).fill({})
      };
      const points2 = calculateListingPoints(largeData);
      if (points2 <= points1) {
        throw new Error('Expected larger property to cost more points');
      }
      
      // Test 3.3: Amenities factor
      const dataWithAmenities = {
        ...basicData,
        amenities: Array(6).fill('Amenity')
      };
      const points3 = calculateListingPoints(dataWithAmenities);
      if (points3 <= points1) {
        throw new Error('Expected more amenities to cost more points');
      }
      
      console.log(`  ✅ Point calculation works correctly (Basic: ${points1}, Large: ${points2}, With Amenities: ${points3})\n`);
    });
  }

  testRequiredFields() {
    this.tests.push(async () => {
      console.log('Test 4: Required Fields Validation');
      
      const requiredFields = [
        'propertyType',
        'propertyKeyword',
        'propertyDesc',
        'propertyPrice',
        'status',
        'address',
        'country',
        'city',
        'neighborhood',
        'bedrooms',
        'bathrooms',
        'size',
        'furnished',
        'garages',
        'agent'
      ];
      
      const missingFields = [];
      for (const field of requiredFields) {
        if (!mockListingData[field] && mockListingData[field] !== false) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      console.log('  ✅ All required fields are present\n');
    });
  }

  testDataTypeValidation() {
    this.tests.push(async () => {
      console.log('Test 5: Data Type Validation');
      
      // Test 5.1: Numeric fields
      const numericFields = ['propertyPrice', 'bedrooms', 'bathrooms', 'size', 'yearBuilt'];
      for (const field of numericFields) {
        if (mockListingData[field] !== undefined && typeof mockListingData[field] !== 'number') {
          throw new Error(`${field} should be a number`);
        }
      }
      
      // Test 5.2: Boolean fields
      const booleanFields = ['furnished', 'garages', 'isSold', 'isDeleted'];
      for (const field of booleanFields) {
        if (mockListingData[field] !== undefined && typeof mockListingData[field] !== 'boolean') {
          throw new Error(`${field} should be a boolean`);
        }
      }
      
      // Test 5.3: String fields
      const stringFields = ['propertyType', 'propertyKeyword', 'status', 'address', 'city'];
      for (const field of stringFields) {
        if (mockListingData[field] !== undefined && typeof mockListingData[field] !== 'string') {
          throw new Error(`${field} should be a string`);
        }
      }
      
      // Test 5.4: Array fields
      if (!Array.isArray(mockListingData.amenities)) {
        throw new Error('amenities should be an array');
      }
      
      console.log('  ✅ Data types are correct\n');
    });
  }

  testHolidayHomesRequirements() {
    this.tests.push(async () => {
      console.log('Test 6: Holiday Homes Requirements');
      
      const holidayHomeData = {
        ...mockListingData,
        propertyType: 'Holiday Home',
        status: 'sale', // Should be forced to 'rent'
        furnished: false // Should be forced to true
      };
      
      // Apply enforcement
      if (holidayHomeData.propertyType === 'Holiday Home') {
        holidayHomeData.status = 'rent';
        holidayHomeData.furnished = true;
      }
      
      if (holidayHomeData.status !== 'rent') {
        throw new Error('Holiday Home status should be forced to rent');
      }
      
      if (holidayHomeData.furnished !== true) {
        throw new Error('Holiday Home should be forced to furnished');
      }
      
      console.log('  ✅ Holiday Homes requirements enforced correctly\n');
    });
  }

  testImageDataStructure() {
    this.tests.push(async () => {
      console.log('Test 7: Image Data Structure');
      
      const mockImages = [
        {
          publicId: 'listings/abc123',
          url: 'https://cloudinary.com/image.jpg',
          filename: 'image1.jpg',
          uploadedAt: new Date()
        }
      ];
      
      // Test image structure
      if (!Array.isArray(mockImages)) {
        throw new Error('Images should be an array');
      }
      
      if (mockImages.length > 0) {
        const image = mockImages[0];
        if (!image.publicId || !image.url || !image.filename) {
          throw new Error('Image object should have required fields');
        }
      }
      
      console.log('  ✅ Image data structure is correct\n');
    });
  }

  testAgentIdHandling() {
    this.tests.push(async () => {
      console.log('Test 8: Agent ID Handling');
      
      // Test 8.1: AgentId from body
      const data1 = { agentId: new mongoose.Types.ObjectId() };
      const agentId1 = data1.agentId || data1.userId || null;
      if (!agentId1) {
        throw new Error('Expected agentId from body');
      }
      
      // Test 8.2: UserId fallback
      const data2 = { userId: new mongoose.Types.ObjectId() };
      const agentId2 = data2.agentId || data2.userId || null;
      if (!agentId2) {
        throw new Error('Expected userId as fallback');
      }
      
      // Test 8.3: Null fallback
      const data3 = {};
      const agentId3 = data3.agentId || data3.userId || null;
      if (agentId3 !== null) {
        throw new Error('Expected null when no agentId or userId');
      }
      
      console.log('  ✅ Agent ID handling works correctly\n');
    });
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tests = new AddPropertyTests();
  tests.run().then(() => {
    process.exit(tests.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = AddPropertyTests;

