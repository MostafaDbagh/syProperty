import Axios from '../axios';

// Favorite API functions
export const favoriteAPI = {
  // Add property to favorites
  addFavorite: async (propertyId) => {
    try {
      const response = await Axios.post('/favorites', { propertyId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove property from favorites
  removeFavorite: async (propertyId) => {
    try {
      const response = await Axios.delete(`/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's favorite properties
  getFavorites: async () => {
    try {
      const response = await Axios.get('/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if property is favorited
  isFavorited: async (propertyId) => {
    try {
      const favorites = await favoriteAPI.getFavorites();
      return favorites.some(fav => fav.propertyId === propertyId || fav._id === propertyId);
    } catch (error) {
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
