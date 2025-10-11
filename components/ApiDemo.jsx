"use client";
import React, { useState } from 'react';
import { authAPI, listingAPI, agentAPI, contactAPI } from '@/apis';

const APITestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runAPITests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Get listings
      console.log('Testing listings API...');
      const listings = await listingAPI.getListings();
      results.listings = { success: true, data: listings, count: listings.length };
    } catch (error) {
      results.listings = { success: false, error: error.message };
    }

    try {
      // Test 2: Get agents
      console.log('Testing agents API...');
      const agents = await agentAPI.getAgents();
      results.agents = { success: true, data: agents, count: agents.length };
    } catch (error) {
      results.agents = { success: false, error: error.message };
    }

    try {
      // Test 3: Get contacts
      console.log('Testing contacts API...');
      const contacts = await contactAPI.getContacts();
      results.contacts = { success: true, data: contacts, count: contacts.length };
    } catch (error) {
      results.contacts = { success: false, error: error.message };
    }

    try {
      // Test 4: Test authentication (this will fail without valid credentials)
      console.log('Testing auth API...');
      await authAPI.signin({ email: 'test@example.com', password: 'test123' });
      results.auth = { success: true, message: 'Auth test completed' };
    } catch (error) {
      results.auth = { success: false, error: error.message, note: 'Expected to fail without valid credentials' };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h1>API Implementation Test</h1>
      <p>This component tests all the implemented APIs to ensure they work correctly.</p>
      
      <button 
        className="btn btn-primary mb-4" 
        onClick={runAPITests}
        disabled={loading}
      >
        {loading ? 'Testing APIs...' : 'Run API Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="row">
          {Object.entries(testResults).map(([apiName, result]) => (
            <div key={apiName} className="col-md-6 mb-3">
              <div className={`card ${result.success ? 'border-success' : 'border-warning'}`}>
                <div className="card-header">
                  <h5 className="mb-0">
                    {apiName.charAt(0).toUpperCase() + apiName.slice(1)} API
                    {result.success ? (
                      <span className="badge bg-success ms-2">Success</span>
                    ) : (
                      <span className="badge bg-warning ms-2">Expected Error</span>
                    )}
                  </h5>
                </div>
                <div className="card-body">
                  {result.success ? (
                    <div>
                      <p className="text-success">✅ API call successful</p>
                      {result.count !== undefined && (
                        <p>Data count: {result.count}</p>
                      )}
                      {result.message && (
                        <p>{result.message}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-warning">⚠️ {result.error}</p>
                      {result.note && (
                        <p className="text-muted">{result.note}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h3>Available APIs</h3>
        <div className="row">
          <div className="col-md-4">
            <h5>Authentication</h5>
            <ul>
              <li>signup()</li>
              <li>signin()</li>
              <li>signout()</li>
              <li>google()</li>
              <li>isAuthenticated()</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Listings</h5>
            <ul>
              <li>getListings()</li>
              <li>searchListings()</li>
              <li>createListing()</li>
              <li>getListingById()</li>
              <li>updateListing()</li>
              <li>deleteListing()</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Other APIs</h5>
            <ul>
              <li>Reviews (create, get, like/dislike)</li>
              <li>Contacts (CRUD operations)</li>
              <li>Favorites (add, remove, get)</li>
              <li>Agents (CRUD with images)</li>
              <li>Points (balance, charge, transactions)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3>Usage Example</h3>
        <pre className="bg-light p-3">
{`import { authAPI, listingAPI } from '@/apis';

// Authentication
const result = await authAPI.signin({
  email: 'user@example.com',
  password: 'password123'
});

// Get listings
const listings = await listingAPI.getListings();

// Create listing with images
const formData = new FormData();
formData.append('title', 'Beautiful House');
formData.append('price', '300000');
formData.append('images', imageFile);
const newListing = await listingAPI.createListing(formData);`}
        </pre>
      </div>
    </div>
  );
};

export default APITestComponent;
