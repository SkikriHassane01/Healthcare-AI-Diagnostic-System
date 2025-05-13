import api from './api';

class AdminService {
  /**
   * Get dashboard statistics for admin
   * @returns {Promise} - API response with admin stats
   */
  async getAdminStats() {
    try {
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting admin stats:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get admin stats');
    }
  }

  /**
   * Get users with pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response with user list and pagination
   */
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.role) queryParams.append('role', params.role);
      if (params.include_inactive !== undefined) queryParams.append('include_inactive', params.include_inactive.toString());

      const response = await api.get(`/api/admin/users?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting users:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  /**
   * Get a single user by ID
   * @param {string} userId - ID of the user
   * @returns {Promise} - API response with user data
   */
  async getUser(userId) {
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise} - API response with created user data
   */
  async createUser(userData) {
    try {
      const response = await api.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  /**
   * Update an existing user
   * @param {string} userId - ID of the user
   * @param {Object} userData - Updated user data
   * @returns {Promise} - API response with updated user data
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  /**
   * Delete a user
   * @param {string} userId - ID of the user
   * @returns {Promise} - API response
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Get patient analytics data
   * @param {string} timeRange - Time range for analytics (month, quarter, year, all)
   * @returns {Promise} - API response with patient analytics
   */
  async getPatientAnalytics(timeRange = 'year') {
    try {
      const response = await api.get(`/api/admin/analytics/patients?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient analytics:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get patient analytics');
    }
  }

  /**
   * Get diagnostics analytics data
   * @param {string} timeRange - Time range for analytics (month, quarter, year, all)
   * @returns {Promise} - API response with diagnostics analytics
   */
  async getDiagnosticsAnalytics(timeRange = 'year') {
    try {
      const response = await api.get(`/api/admin/analytics/diagnostics?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error getting diagnostics analytics:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get diagnostics analytics');
    }
  }

  /**
   * Generate report
   * @param {Object} reportConfig - Report configuration
   * @returns {Promise} - API response with report data or download link
   */
  async generateReport(reportConfig) {
    try {
      const response = await api.post('/api/admin/reports/generate', reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  }

  /**
   * Get system settings
   * @returns {Promise} - API response with system settings
   */
  async getSystemSettings() {
    try {
      const response = await api.get('/api/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error getting system settings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get system settings');
    }
  }

  /**
   * Update system settings
   * @param {Object} settings - Updated system settings
   * @returns {Promise} - API response
   */
  async updateSystemSettings(settings) {
    try {
      const response = await api.put('/api/admin/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update system settings');
    }
  }

  /**
   * Get system logs
   * @param {Object} params - Query parameters (level, start_date, end_date, limit)
   * @returns {Promise} - API response with logs
   */
  async getSystemLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.level) queryParams.append('level', params.level);
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get(`/api/admin/logs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting system logs:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get system logs');
    }
  }
}

// Create singleton instance
const adminService = new AdminService();
export default adminService;