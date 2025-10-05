import Axios from '../axios';

// Authentication API functions
export const authAPI = {
  // User signup
  signup: async (userData) => {
    try {
      const response = await Axios.post('/auth/signup', userData);
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
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      return response.data;
    } catch (error) {
      // Even if the request fails, clear local storage
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
  }
};

export default authAPI;