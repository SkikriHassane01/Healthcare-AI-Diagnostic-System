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
      const response = await api.get('/api/admin/analytics/diagnostics');
      
      // Extract data from diagnosticsByType object in the response
      // and format it for the chart component
      const typesData = [];
      
      if (response.data && response.data.diagnosticsByType) {
        Object.entries(response.data.diagnosticsByType).forEach(([type, data]) => {
          if (data && typeof data.total === 'number') {
            typesData.push({
              type: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(), // Format camelCase to Title Case
              count: data.total
            });
          }
        });
      }
      
      // Sort by count in descending order
      typesData.sort((a, b) => b.count - a.count);
      
      return {
        data: typesData
      };
    } catch (error) {
      console.error('Error getting diagnostics by type:', error);
      
      // Return empty data instead of throwing to handle errors gracefully
      return { data: [] };
    }
  }

  /**
   * Get user registration trends
   * @param {string} timeRange - 'week', 'month', or 'year'
   * @returns {Promise} - API response with user registration data
   */
  async getUserRegistrationTrend(timeRange = 'month') {
    try {
      const response = await api.get(`/api/admin/analytics/users?timeRange=${timeRange}`);
      
      // Format the data for the chart component
      let data = [];
      
      if (response.data && response.data.registrations) {
        data = response.data.registrations.map(item => ({
          date: item.label,
          count: item.count
        }));
      }
      
      return { data };
    } catch (error) {
      console.error('Error getting user registration trends:', error);
      
      // Return empty data instead of throwing to handle errors gracefully
      return { data: [] };
    }
  }

  /**
   * Get growth statistics for dashboard
   * @returns {Promise} - API response with growth data
   */
  async getGrowthStats() {
    try {
      const response = await api.get('/api/admin/analytics/growth');
      
      // Default values in case the API doesn't return the expected data
      const defaultGrowth = { percentage: 0, direction: 'up' };
      
      return {
        data: {
          userGrowth: response.data?.userGrowth || defaultGrowth,
          patientGrowth: response.data?.patientGrowth || defaultGrowth,
          diagnosticsGrowth: response.data?.diagnosticsGrowth || defaultGrowth,
          monthlyGrowth: response.data?.monthlyGrowth || defaultGrowth
        }
      };
    } catch (error) {
      console.error('Error getting growth statistics:', error);
      
      // Return default values instead of throwing to handle errors gracefully
      const defaultGrowth = { percentage: 0, direction: 'up' };
      return {
        data: {
          userGrowth: defaultGrowth,
          patientGrowth: defaultGrowth,
          diagnosticsGrowth: defaultGrowth,
          monthlyGrowth: defaultGrowth
        }
      };
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