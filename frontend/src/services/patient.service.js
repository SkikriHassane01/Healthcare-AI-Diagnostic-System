import api from './api';

class PatientService {
  /**
   * Get a list of patients with optional search and pagination
   * @param {Object} params - Query parameters (search, page, per_page)
   * @returns {Promise} - API response with patient list and pagination info
   */
  async getPatients(params = {}) {
    try {
      console.log('Fetching patients with params:', params);
      // Ensure we use the URL without trailing slash
      const response = await api.get('/api/patients', { params });
      console.log('Patients API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getPatients:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  }

  /**
   * Get a single patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise} - API response with patient data
   */
  async getPatient(id) {
    try {
      const response = await api.get(`/api/patients/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise} - API response with created patient data
   */
  async createPatient(patientData) {
    try {
      console.log('Creating patient with data:', patientData);
      
      // Ensure numbers are properly formatted
      if (patientData.height) patientData.height = parseFloat(patientData.height);
      if (patientData.weight) patientData.weight = parseFloat(patientData.weight);
      
      const response = await api.post('/api/patients', patientData);
      console.log('Create patient response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  }

  /**
   * Update an existing patient
   * @param {string} id - Patient ID
   * @param {Object} patientData - Updated patient data
   * @returns {Promise} - API response with updated patient data
   */
  async updatePatient(id, patientData) {
    try {
      console.log(`Updating patient ${id} with data:`, patientData);
      
      // If it's just an activation/deactivation update
      if (patientData && (Object.keys(patientData).length === 1 && 'active' in patientData)) {
        // Use PATCH for partial updates
        const response = await api.patch(`/api/patients/${id}/status`, patientData);
        console.log('Update patient status response:', response.data);
        return response.data;
      } else {
        // Use PUT for full updates
        const response = await api.put(`/api/patients/${id}`, patientData);
        console.log('Update patient response:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  }

  /**
   * Delete a patient
   * @param {string} id - Patient ID
   * @returns {Promise} - API response
   */
  async deletePatient(id) {
    try {
      console.log(`Deleting patient with ID: ${id}`);
      const response = await api.delete(`/api/patients/${id}`);
      console.log('Delete patient response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = 
        error.response.data.message || 
        error.response.data.detail ||
        'An error occurred with the response';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Create singleton instance
const patientService = new PatientService();
export default patientService;