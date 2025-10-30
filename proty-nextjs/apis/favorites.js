import Axios from '../axios';
import logger from '../utils/logger';

// Favorite API functions
export const favoriteAPI = {
  // Add property to favorites
  addFavorite: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await Axios.post('/favorites', { propertyId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove property from favorites
  removeFavorite: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await Axios.delete(`/favorites/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's favorite properties
  getFavorites: async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get('/favorites', {
        params, // Pass pagination parameters
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if property is favorited
  isFavorited: async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      const response = await Axios.get(`/favorites/check/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data?.isFavorited || false;
    } catch (error) {
      // Don't log error for unauthenticated users
      if (error.response?.status !== 401) {
        logger.error('Error checking if favorited:', error);
      }
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (propertyId) => {
    try {
      const isFavorited = await favoriteAPI.isFavorited(propertyId);
      
      if (isFavorited) {
        return await favoriteAPI.removeFavorite(propertyId);
      } else {
        return await favoriteAPI.addFavorite(propertyId);
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default favoriteAPI;
