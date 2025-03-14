import axios from 'axios';

/**
 * Base API service for making HTTP requests to the backend
 * Creates a pre-configured axios instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// runs before each request
// Add a request interceptor to include auth token with every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// runs after each response
// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      console.log('Authentication error:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;