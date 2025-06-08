import { Axios } from "axios";


export const createAgent = async (formData) => {
    const response = await Axios.post('agents/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };
  
  // UPDATE agent
  export const updateAgent = async (id, formData) => {
    const response = await Axios.put(`agents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };
  
  // GET all agents
  export const getAgents = async () => {
    const response = await Axios.get('agents');
    return response.data;
  };
  
  // GET agent by ID
  export const getAgentById = async (id) => {
    const response = await Axios.get(`agents/${id}`);
    return response.data;
  };
  
  // DELETE agent
  export const deleteAgent = async (id) => {
    const response = await Axios.delete(`agents/${id}`);
    return response.data;
  };