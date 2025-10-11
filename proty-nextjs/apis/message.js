import Axios from '../axios';

export const messageAPI = {
  // Get messages for a specific agent with filtering and pagination
  getMessagesByAgent: async (agentId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/message/agent/${agentId}`, {
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

  // Get a single message by ID
  getMessageById: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.get(`/message/${messageId}`, {
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

  // Create a new message (for contact forms)
  createMessage: async (messageData) => {
    try {
      const response = await Axios.post('/message/', messageData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.patch(`/message/${messageId}/read`, {}, {
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

  // Reply to a message
  replyToMessage: async (messageId, response) => {
    try {
      const token = localStorage.getItem('token');
      const responseData = await Axios.patch(`/message/${messageId}/reply`, { response }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return responseData.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Archive a message
  archiveMessage: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.patch(`/message/${messageId}/archive`, {}, {
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

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Axios.delete(`/message/${messageId}`, {
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
