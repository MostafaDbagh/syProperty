"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRouteProtection from '@/hooks/useRouteProtection';
import { useGlobalModal } from '@/components/contexts/GlobalModalContext';

const RouteProtectionTest = () => {
  const router = useRouter();
  const { checkRouteAccess, getUserRole } = useRouteProtection();
  const { showModal } = useGlobalModal();
  const [currentRole, setCurrentRole] = useState('guest');
  const [testResults, setTestResults] = useState([]);

  // Test routes
  const testRoutes = [
    { path: '/', name: 'Home', expectedAccess: { guest: true, user: true, agent: true } },
    { path: '/dashboard', name: 'Dashboard', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/add-property', name: 'Add Property', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/my-property', name: 'My Property', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/my-properties', name: 'My Properties', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/messages', name: 'Messages', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/review', name: 'Review', expectedAccess: { guest: false, user: false, agent: true } },
    { path: '/my-favorites', name: 'My Favorites', expectedAccess: { guest: false, user: true, agent: true } },
    { path: '/my-package', name: 'My Package', expectedAccess: { guest: false, user: true, agent: true } },
    { path: '/my-profile', name: 'My Profile', expectedAccess: { guest: false, user: true, agent: true } },
  ];

  // Simulate different user roles
  const simulateRole = (role) => {
    // Clear existing user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    if (role === 'guest') {
      setCurrentRole('guest');
      return;
    }
    
    // Create mock user data
    const mockUser = {
      _id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: role
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');
    setCurrentRole(role);
  };

  // Test route access for current role
  const testRouteAccess = () => {
    const results = testRoutes.map(route => {
      const routeCheck = checkRouteAccess(route.path);
      const expectedAccess = route.expectedAccess[currentRole];
      const actualAccess = routeCheck.isAuthorized;
      
      return {
        route: route.name,
        path: route.path,
        expected: expectedAccess,
        actual: actualAccess,
        passed: expectedAccess === actualAccess,
        userRole: routeCheck.userRole,
        requiredAccess: routeCheck.requiredAccess
      };
    });
    
    setTestResults(results);
  };

  // Test modal triggers
  const testModalTriggers = () => {
    console.log('Testing modal triggers...');
    
    // Test guest accessing agent route
    if (currentRole === 'guest') {
      console.log('Testing guest → register modal');
      showModal('register');
    }
    
    // Test user accessing agent route
    if (currentRole === 'user') {
      console.log('Testing user → become agent modal');
      showModal('becomeAgent');
    }
  };

  // Test redirect behavior
  const testRedirect = (path) => {
    console.log(`Testing redirect to ${path} for role: ${currentRole}`);
    router.push(path);
  };

  useEffect(() => {
    testRouteAccess();
  }, [currentRole]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Route Protection Test</h1>
      
      {/* Role Simulation */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Role Simulation</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => simulateRole('guest')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentRole === 'guest' ? '#007bff' : '#f8f9fa',
              color: currentRole === 'guest' ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Guest User
          </button>
          <button 
            onClick={() => simulateRole('user')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentRole === 'user' ? '#007bff' : '#f8f9fa',
              color: currentRole === 'user' ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Regular User
          </button>
          <button 
            onClick={() => simulateRole('agent')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentRole === 'agent' ? '#007bff' : '#f8f9fa',
              color: currentRole === 'agent' ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Agent User
          </button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong>Current Role:</strong> {currentRole}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={testModalTriggers}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Modal Triggers
          </button>
          <button 
            onClick={testRouteAccess}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Tests
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Route Access Test Results</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Path</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Expected</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actual</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Required Access</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{result.route}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{result.path}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {result.expected ? '✅ Allowed' : '❌ Blocked'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {result.actual ? '✅ Allowed' : '❌ Blocked'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      color: result.passed ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {result.passed ? '✅ PASS' : '❌ FAIL'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {result.requiredAccess || 'Public'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Navigation Test */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Quick Navigation Test</h2>
        <p>Click these links to test actual redirect behavior:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {testRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => testRedirect(route.path)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>Test Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3>Guest User</h3>
            <ul>
              <li>✅ Can access: Home page</li>
              <li>❌ Blocked from: All dashboard routes</li>
              <li>🔄 Redirect: Home + Register modal</li>
            </ul>
          </div>
          <div>
            <h3>Regular User</h3>
            <ul>
              <li>✅ Can access: Home, My Favorites, My Package, My Profile</li>
              <li>❌ Blocked from: Agent routes</li>
              <li>🔄 Redirect: Home + Become Agent modal</li>
            </ul>
          </div>
          <div>
            <h3>Agent User</h3>
            <ul>
              <li>✅ Can access: All routes</li>
              <li>🛡️ Full dashboard access</li>
              <li>🚀 No restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteProtectionTest;
