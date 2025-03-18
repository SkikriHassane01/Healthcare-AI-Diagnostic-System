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
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise} - API response with created patient data
   */
  async createPatient(patientData) {
    try {
      console.log('Creating patient with data:', patientData);
      // Ensure we use the URL without trailing slash
      const response = await api.post('/api/patients', patientData);
      console.log('Create patient response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
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
      const response = await api.put(`/api/patients/${id}`, patientData);
      console.log('Update patient response:', response.data);
      return response.data;
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
}

// Create singleton instance
const patientService = new PatientService();
export default patientService;