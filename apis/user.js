import Axios from '../axios';

// User API functions
export const userAPI = {
  // Get user profile by ID
  getProfile: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(`/user/update/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.post(
        `/user/update/${userId}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user account
  deleteAccount: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user listings
  getUserListings: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/user/${userId}/listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userAPI;

