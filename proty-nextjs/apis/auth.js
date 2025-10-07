import Axios from '../axios';
import { store } from '../store/store';
import { setCredentials, logout } from '../store/slices/authSlice';

// Authentication API functions
export const authAPI = {
  // User signup
  signup: async (userData) => {
    try {
      const response = await Axios.post('/auth/signup', userData);
      
      // Don't store anything in localStorage after signup
      // User needs to login to get authenticated
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User signin
  signin: async (credentials) => {
    try {
      const response = await Axios.post('/auth/signin', credentials);
      
      // Store token in localStorage and cookies
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=86400`; // 24 hours
      }
      
      // Store user data and dispatch Redux action
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch Redux action to update auth state
        store.dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Google authentication
  google: async (googleData) => {
    try {
      const response = await Axios.post('/auth/google', googleData);
      
      // Store token in localStorage and cookies
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=86400`; // 24 hours
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User signout
  signout: async () => {
    try {
      const response = await Axios.get('/auth/signout');
      
      // Clear token from localStorage and cookies
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Dispatch Redux action to clear auth state
      store.dispatch(logout());
      
      return response.data;
    } catch (error) {
      // Even if the request fails, clear local storage and Redux state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Dispatch Redux action to clear auth state
      store.dispatch(logout());
      
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token') || 
                  document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];
    return !!token;
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token') || 
           document.cookie
             .split('; ')
             .find(row => row.startsWith('token='))
             ?.split('=')[1];
  },

  // Initialize Redux state from localStorage
  initializeAuthState: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        store.dispatch(setCredentials({
          user: user,
          token: token
        }));
        return true;
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        store.dispatch(logout());
        return false;
      }
    }
    
    // No token or user data - not authenticated
    return false;
  },

  // OTP APIs
  sendOTP: async (email) => {
    try {
      const response = await Axios.post('/auth/send-otp', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await Axios.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authAPI;