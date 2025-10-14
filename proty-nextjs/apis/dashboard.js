import axios from '../axios';

const dashboardAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const response = await axios.get('/api/dashboard/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }
};

export default dashboardAPI;
