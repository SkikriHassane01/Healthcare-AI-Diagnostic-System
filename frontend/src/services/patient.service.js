import api from './api';

class PatientService {
  /**
   * Get a list of patients with optional search and pagination
   * @param {Object} params - Query parameters (search, page, per_page)
   * @returns {Promise} - API response with patient list and pagination info
   */
  async getPatients(params = {}) {
    try {
      const response = await api.get('/api/patients', { params });
      return response.data;
    } catch (error) {
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
      throw new Error(error.response?.data?.message || 'Failed to fetch patient details');
    }
  }

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise} - API response with created patient data
   */
  async createPatient(patientData) {
    try {
      const response = await api.post('/api/patients', patientData);
      return response.data;
    } catch (error) {
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
      const response = await api.put(`/api/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  }

  /**
   * Delete (archive) a patient
   * @param {string} id - Patient ID
   * @returns {Promise} - API response
   */
  async deletePatient(id) {
    try {
      const response = await api.delete(`/api/patients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  }
}

export default new PatientService();