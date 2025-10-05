"use client";
import React, { useState, useEffect } from 'react';
import { listingAPI } from '@/apis';

const ListingAPITest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Get all listings
      console.log('Testing getListings...');
      const listings = await listingAPI.getListings();
      results.getListings = { 
        success: true, 
        count: listings.length,
        message: `Found ${listings.length} listings`
      };
    } catch (error) {
      results.getListings = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      // Test 2: Search listings
      console.log('Testing searchListings...');
      const searchResults = await listingAPI.searchListings({ location: 'New York' });
      results.searchListings = { 
        success: true, 
        count: searchResults.data?.length || 0,
        message: `Found ${searchResults.data?.length || 0} listings in New York`
      };
    } catch (error) {
      results.searchListings = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      // Test 3: Get specific listing (using first listing from search)
      console.log('Testing getListingById...');
      const searchResults = await listingAPI.searchListings({ location: 'New York' });
      if (searchResults.data && searchResults.data.length > 0) {
        const firstListing = searchResults.data[0];
        const listing = await listingAPI.getListingById(firstListing._id);
        results.getListingById = { 
          success: true, 
          message: `Retrieved listing: ${listing.propertyKeyword || 'Unknown'}`
        };
      } else {
        results.getListingById = { 
          success: false, 
          error: 'No listings found to test with'
        };
      }
    } catch (error) {
      results.getListingById = { 
        success: false, 
        error: error.message 
      };
    }

    try {
      // Test 4: Get state count
      console.log('Testing getStateCount...');
      const stateCount = await listingAPI.getStateCount();
      results.getStateCount = { 
        success: true, 
        message: `Retrieved state count data`
      };
    } catch (error) {
      results.getStateCount = { 
        success: false, 
        error: error.message 
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h1>Listing API Test</h1>
      <p>This component tests all the listing API endpoints to ensure they work correctly.</p>
      
      <button 
        className="btn btn-primary mb-4" 
        onClick={runTests}
        disabled={loading}
      >
        {loading ? 'Testing APIs...' : 'Run Listing API Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="row">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="col-md-6 mb-3">
              <div className={`card ${result.success ? 'border-success' : 'border-danger'}`}>
                <div className="card-header">
                  <h5 className="mb-0">
                    {testName}
                    {result.success ? (
                      <span className="badge bg-success ms-2">Success</span>
                    ) : (
                      <span className="badge bg-danger ms-2">Error</span>
                    )}
                  </h5>
                </div>
                <div className="card-body">
                  {result.success ? (
                    <div>
                      <p className="text-success">✅ API call successful</p>
                      <p>{result.message}</p>
                      {result.count !== undefined && (
                        <p><strong>Count:</strong> {result.count}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-danger">❌ {result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h3>API Endpoints Tested</h3>
        <ul>
          <li><strong>GET /api/listing</strong> - Get all listings</li>
          <li><strong>GET /api/listing/search</strong> - Search listings with filters</li>
          <li><strong>GET /api/listing/:id</strong> - Get specific listing by ID</li>
          <li><strong>GET /api/listing/stateCount</strong> - Get state count statistics</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3>Usage Example</h3>
        <pre className="bg-light p-3">
{`import { listingAPI } from '@/apis';

// Get all listings
const listings = await listingAPI.getListings();

// Search listings
const searchResults = await listingAPI.searchListings({
  location: 'New York',
  minPrice: 100000,
  maxPrice: 500000
});

// Get specific listing
const listing = await listingAPI.getListingById('listing_id');

// Get state count
const stateCount = await listingAPI.getStateCount();`}
        </pre>
      </div>
    </div>
  );
};

export default ListingAPITest;
