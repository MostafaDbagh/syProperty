import axios from 'axios'

export const Axios = axios.create({
  //  baseURL: 'https://toma-boutique-bc4536360c89.herokuapp.com/', 
    baseURL: 'http://localhost:4060/', 

    timeout: 5000, // Request timeout in milliseconds
    headers: {
      'Authorization': 'Bearer YourAccessToken', // Custom headers
      'Content-Type': 'application/json', // Example content type
    },
  })

