import Axios from '../axios';

// Agent API functions
export const agentAPI = {
  // Create a new agent
  createAgent: async (agentData) => {
    try {
      const formData = new FormData();
      
      // Add all agent data to FormData
      Object.keys(agentData).forEach(key => {
        if (key === 'avatar' && agentData[key] instanceof File) {
          formData.append('avatar', agentData[key]);
        } else if (key === 'poster' && agentData[key] instanceof File) {
          formData.append('poster', agentData[key]);
        } else {
          formData.append(key, agentData[key]);
        }
      });

      const response = await Axios.post('/agents/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all agents
  getAgents: async (params = {}) => {
    try {
      const response = await Axios.get('/agents', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get agent by ID
  getAgentById: async (id) => {
    try {
      const response = await Axios.get(`/agents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update agent
  updateAgent: async (id, agentData) => {
    try {
      const formData = new FormData();
      
      // Add all agent data to FormData
      Object.keys(agentData).forEach(key => {
        if (key === 'avatar' && agentData[key] instanceof File) {
          formData.append('avatar', agentData[key]);
        } else if (key === 'poster' && agentData[key] instanceof File) {
          formData.append('poster', agentData[key]);
        } else {
          formData.append(key, agentData[key]);
        }
      });

      const response = await Axios.put(`/agents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete agent
  deleteAgent: async (id) => {
    try {
      const response = await Axios.delete(`/agents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default agentAPI;