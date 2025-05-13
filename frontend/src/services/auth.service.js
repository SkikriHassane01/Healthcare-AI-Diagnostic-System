// frontend/src/services/auth.service.js
import api from './api';

// Define storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data including username, email, password, etc.
   * @returns {Promise} - API response with user data and token
   */
  async register(userData) {
    try {
      console.log('Registering user:', userData.username);
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.token) {
        console.log('Registration successful, storing token');
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      } else {
        console.error('No token received in registration response');
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Login a user
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise} - API response with user data and token
   */
  async login(username, password) {
    try {
      console.log('Attempting login for:', username);
      const response = await api.post('/api/auth/login', { username, password });
      
      if (response.data.token) {
        console.log('Login successful, storing token');
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      } else {
        console.error('No token received in login response');
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
  
  /**
   * Logout the current user
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Ensure authentication is persisted
   * This helps maintain auth state during page refresh
   * @returns {boolean} - Whether authentication was successfully persisted
   */
  persistAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    
    if (token && user) {
      // If we need to do any refresh or validation, we could do it here
      // Make sure token is also set in the API headers
      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      console.log('Auth token persisted successfully');
      return true;
    }
    return false;
  }

  /**
   * Get the current logged in user from local storage
   * @returns {Object|null} - User object or null if not logged in
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Get the user profile from the API
   * @returns {Promise} - API response with user data
   */
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  /**
   * Check if user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if current user is an admin
   * @returns {boolean} - True if user is an admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  /**
   * Get the current user from local storage or return a default user
   * @returns {Object|null} - User object or default user if not found
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return {
        first_name: 'Demo',
        last_name: 'User',
        username: 'demouser',
        email: 'demo@example.com',
        role: 'doctor'
      };
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }
}

export default new AuthService();