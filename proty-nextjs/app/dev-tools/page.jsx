"use client";
import { useState, useEffect } from 'react';
import { useAuthState } from '@/store/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

export default function DevTools() {
  const [status, setStatus] = useState('');
  const { user, isAuthenticated, isAgent, displayName } = useAuthState();
  const dispatch = useDispatch();

  const loginAsUser = () => {
    const testUser = {
      _id: 'test-user-id',
      username: 'testuser',
      email: 'user@test.com',
      role: 'user',
    };
    const testToken = 'test-token-user-123';
    
    dispatch(setCredentials({ user: testUser, token: testToken }));
    setStatus('✅ Logged in as USER!');
  };

  const loginAsAgent = () => {
    const testAgent = {
      _id: 'test-agent-id',
      username: 'testagent',
      email: 'agent@test.com',
      role: 'agent',
    };
    const testToken = 'test-token-agent-123';
    
    dispatch(setCredentials({ user: testAgent, token: testToken }));
    setStatus('✅ Logged in as AGENT!');
  };

  const changeToAgent = () => {
    if (user) {
      dispatch(setCredentials({ 
        user: { ...user, role: 'agent' }, 
        token: user.token || 'test-token' 
      }));
      setStatus('✅ Role changed to AGENT!');
    } else {
      loginAsAgent();
    }
  };

  const changeToUser = () => {
    if (user) {
      dispatch(setCredentials({ 
        user: { ...user, role: 'user' }, 
        token: user.token || 'test-token' 
      }));
      setStatus('✅ Role changed to USER!');
    } else {
      loginAsUser();
    }
  };

  // Auto-initialize if no user data on mount
  useEffect(() => {
    if (!user || !user._id) {
      console.log('⚙️ No user data found, initializing as test user...');
      loginAsUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>🛠️ Developer Tools</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3>Current Redux Auth State:</h3>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px' }}>
          {JSON.stringify({
            isAuthenticated,
            isAgent,
            displayName,
            user
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Quick Login (For Testing):</h3>
        <button 
          onClick={loginAsUser}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom: '10px'
          }}
        >
          🔐 Login as User
        </button>
        
        <button 
          onClick={loginAsAgent}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#8B5CF6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          🔐 Login as Agent
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Change Role:</h3>
        <button 
          onClick={changeToAgent}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🎯 Make Me Agent
        </button>
        
        <button 
          onClick={changeToUser}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          👤 Make Me User
        </button>
      </div>

      {status && (
        <div style={{
          padding: '15px',
          background: status.includes('✅') ? '#D1FAE5' : '#FEE2E2',
          color: status.includes('✅') ? '#065F46' : '#991B1B',
          borderRadius: '6px',
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {status}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#FEF3C7', borderRadius: '6px' }}>
        <h4 style={{ marginBottom: '10px' }}>⚠️ Note:</h4>
        <p>This page uses <strong>Redux + Redux Persist</strong> for state management. Changes are automatically persisted to localStorage and will survive page refreshes.</p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>State is stored in Redux and persisted to localStorage</li>
          <li>Header button and dropdown automatically update based on role</li>
          <li>Login/logout functionality integrated with Redux</li>
        </ul>
      </div>
    </div>
  );
}

