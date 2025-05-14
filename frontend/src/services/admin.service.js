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
   * Get diagnostic analytics data by type
   * @returns {Promise} - API response with diagnostics by type data
   */
  async getDiagnosticsByType() {
    try {
      const response = await api.get('/api/admin/analytics/diagnostics-by-type');
      return {
        data: Object.entries(response.data.diagnostics).map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(), // Format camelCase to Title Case
          count: count
        })).sort((a, b) => b.count - a.count) // Sort by count descending
      };
    } catch (error) {
      console.error('Error getting diagnostics by type:', error);
      throw error;
    }
  }

  /**
   * Get user registration trends
   * @param {string} timeRange - 'week', 'month', or 'year'
   * @returns {Promise} - API response with user registration data
   */
  async getUserRegistrationTrend(timeRange = 'month') {
    try {
      const response = await api.get(`/api/admin/analytics/user-registration?timeRange=${timeRange}`);
      return {
        data: response.data.registrations.map(item => ({
          date: item.label,
          count: item.count
        }))
      };
    } catch (error) {
      console.error('Error getting user registration trends:', error);
      throw error;
    }
  }

  /**
   * Get growth statistics for dashboard
   * @returns {Promise} - API response with growth data
   */
  async getGrowthStats() {
    try {
      const response = await api.get('/api/admin/analytics/growth');
      return {
        data: {
          userGrowth: {
            percentage: response.data.userGrowth.percentage,
            direction: response.data.userGrowth.direction
          },
          patientGrowth: {
            percentage: response.data.patientGrowth.percentage,
            direction: response.data.patientGrowth.direction
          },
          diagnosticsGrowth: {
            percentage: response.data.diagnosticsGrowth.percentage,
            direction: response.data.diagnosticsGrowth.direction
          },
          monthlyGrowth: {
            percentage: response.data.monthlyGrowth.percentage,
            direction: response.data.monthlyGrowth.direction
          }
        }
      };
    } catch (error) {
      console.error('Error getting growth statistics:', error);
      throw error;
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
}

// Create singleton instance
const adminService = new AdminService();
export default adminService;