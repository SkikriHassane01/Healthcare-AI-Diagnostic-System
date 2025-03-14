import api from './api';

/**
 * Authentication service for handling user registration, login, and profile management
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data including username, email, password, etc.
   * @returns {Promise} - API response with user data and token
   */
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
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
      const response = await api.post('/api/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Get the current logged in user from local storage
   * @returns {Object|null} - User object or null if not logged in
   */
  getUser() {
    const userStr = localStorage.getItem('user');
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
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Check if current user is an admin
   * @returns {boolean} - True if user is an admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
}

export default new AuthService();
