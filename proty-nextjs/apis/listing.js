import { Axios } from "axios";



// Get all listings
export const getAllListings = async () => {
  const response = await Axios.get('listing');
  return response.data;
};

// Get listing by ID
export const getListingById = async (id) => {
  const response = await Axios.get(`listing/${id}`);
  return response.data;
};

// Get listings by agent ID
export const getListingsByAgent = async (agentId) => {
  const response = await Axios.get(`listing/agent/${agentId}`);
  return response.data;
};

// Search listings with filters (assuming you pass search params)
export const searchListings = async (params) => {
  const response = await Axios.get(`listing/search`, { params });
  return response.data;
};

// Create a new listing
export const addListing = async (data) => {
  const response = await Axios.post('listing/add', data);
  return response.data;
};

// Update listing (requires token)
export const updateListing = async (id, data) => {
  const response = await Axios.post(`listing/update/${id}`, data);
  return response.data;
};

// Delete listing (requires token)
export const deleteListing = async (id) => {
  const response = await Axios.delete(`listing/delete/${id}`);
  return response.data;
};
