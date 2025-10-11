import Axios from '../axios';

// Listing API functions
export const listingAPI = {
  // Get all listings (using search endpoint)
  getListings: async (params = {}) => {
    try {
      const response = await Axios.get('/listing/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search/filter listings
  searchListings: async (searchParams) => {
    try {
      const response = await Axios.get('/listing/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new listing
  createListing: async (listingData) => {
    try {
      const formData = new FormData();
      
      // Add all listing data to FormData
      Object.keys(listingData).forEach(key => {
        if (key === 'images' && Array.isArray(listingData[key])) {
          // Handle multiple image files
          listingData[key].forEach((image, index) => {
            formData.append('images', image);
          });
        } else if (key === 'imageNames' && Array.isArray(listingData[key])) {
          // Handle image names
          listingData[key].forEach((name, index) => {
            formData.append('imageNames', name);
          });
        } else {
          formData.append(key, listingData[key]);
        }
      });

      const response = await Axios.post('/listing/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listing by ID
  getListingById: async (id) => {
    try {
      const response = await Axios.get(`/listing/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get listing images
  getListingImages: async (id) => {
    try {
      const response = await Axios.get(`/listing/${id}/images`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update listing
  updateListing: async (id, listingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(`/listing/update/${id}`, listingData, {
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

  // Delete listing
  deleteListing: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/listing/delete/${id}`, {
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

  // Get listings by agent with pagination and filtering
  getListingsByAgent: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/listing/agent/${agentId}`, {
        params,
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

  // Get state count statistics
  getStateCount: async () => {
    try {
      const response = await Axios.get('/listing/stateCount');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Increment visit count for a listing
  incrementVisitCount: async (id) => {
    try {
      const response = await Axios.post(`/listing/${id}/visit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get most visited listings by agent
  getMostVisitedListings: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/listing/agent/${agentId}/most-visited`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default listingAPI;