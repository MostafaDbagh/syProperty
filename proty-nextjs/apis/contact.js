import { Axios } from "axios";


export const createContact = async (data) => {
    const response = await Axios.post('contact', data);
    return response.data;
  };
  
  // Get all contact messages
  export const getContacts = async () => {
    const response = await Axios.get('contact');
    return response.data;
  };
  
  // Get a specific contact message by ID
  export const getContactById = async (id) => {
    const response = await Axios.get(`contact/${id}`);
    return response.data;
  };
  
  // Delete a specific contact message by ID
  export const deleteContactById = async (id) => {
    const response = await Axios.delete(`contact/${id}`);
    return response.data;
  };
  