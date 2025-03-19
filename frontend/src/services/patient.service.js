import api from './api';

class PatientService {
  /**
   * Get a list of patients with optional search and pagination
   * @param {Object} params - Query parameters (search, page, per_page, include_inactive)
   * @returns {Promise} - API response with patient list and pagination info
   */
  async getPatients(params = {}) {
    try {
      console.log('Fetching patients with params:', params);
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.include_inactive !== undefined) queryParams.append('include_inactive', params.include_inactive.toString());

      const response = await api.get(`/api/patients?${queryParams.toString()}`);
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
      
      // Convert active to is_active if needed for backward compatibility
      if (patientData && 'active' in patientData && !('is_active' in patientData)) {
        patientData.is_active = patientData.active;
        delete patientData.active;
      }
      
      // Use PUT for all updates
      const response = await api.put(`/api/patients/${id}`, patientData);
      console.log('Update patient response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  }

  /**
     * Delete a patient - either permanently or by deactivating
     * @param {string} id - Patient ID
     * @param {boolean} permanent - Whether to permanently delete (true) or just deactivate (false)
     * @returns {Promise} - API response
     */
  async deletePatient(id, permanent = false) {
    try {
      console.log(`${permanent ? 'Permanently deleting' : 'Deactivating'} patient with ID: ${id}`);
      
      // Send permanent flag in request body
      const response = await api.delete(`/api/patients/${id}`, {
        data: { permanent }
      });
      
      console.log('Delete patient response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error ${permanent ? 'deleting' : 'deactivating'} patient ${id}:`, error);
      throw new Error(error.response?.data?.message || `Failed to ${permanent ? 'delete' : 'deactivate'} patient`);
    }
  }
}

// Create singleton instance
const patientService = new PatientService();
export default patientService;