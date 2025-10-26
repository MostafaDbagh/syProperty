import axios from 'axios'
const localhost = 'http://localhost:5500/api'
const heroku = 'https://proty-api-mostafa-56627d8ca9aa.herokuapp.com/api'
export const Axios = axios.create({
  baseURL: heroku, // Use Heroku for production
  timeout: 30000, // Request timeout in milliseconds (increased to 30 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
Axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('token') || 
                  document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login for specific authentication endpoints
    // Don't redirect for listing operations to avoid disrupting user workflow
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Only redirect to login for auth-related endpoints
      if (url.includes('/auth/') || url.includes('/login') || url.includes('/register')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default Axios;

