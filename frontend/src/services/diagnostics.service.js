import api from './api';

class DiagnosticsService {
  /**
   * Get available diagnostic models
   * @returns {Promise} API response with available models
   */
  async getAvailableModels() {
    try {
      const response = await api.get('/api/diagnostics/models');
      return response.data;
    } catch (error) {
      console.error('Error getting available models:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get available models');
    }
  }

  /**
   * Make a diabetes prediction for a patient
   * @param {string} patientId - ID of the patient
   * @param {Object} data - Prediction data (age, gender, etc.)
   * @returns {Promise} API response with prediction result
   */
  async predictDiabetes(patientId, data) {
    try {
      console.log(`Making diabetes prediction for patient ${patientId}:`, data);
      const response = await api.post(`/api/diagnostics/diabetes/predict/${patientId}`, data);
      console.log('Diabetes prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making diabetes prediction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to make diabetes prediction');
    }
  }

  /**
   * Get diabetes prediction history for a patient
   * @param {string} patientId - ID of the patient
   * @returns {Promise} API response with prediction history
   */
  async getDiabetesHistory(patientId) {
    try {
      const response = await api.get(`/api/diagnostics/diabetes/history/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting diabetes history:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get diabetes prediction history');
    }
  }

  /**
   * Get a specific diabetes prediction
   * @param {string} predictionId - ID of the prediction
   * @returns {Promise} API response with prediction details
   */
  async getDiabetesPrediction(predictionId) {
    try {
      const response = await api.get(`/api/diagnostics/diabetes/prediction/${predictionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting diabetes prediction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get diabetes prediction');
    }
  }

  /**
   * Update a diabetes prediction with doctor's assessment
   * @param {string} predictionId - ID of the prediction
   * @param {Object} data - Update data including doctor's assessment
   * @returns {Promise} API response with updated prediction
   */
  async updateDiabetesPrediction(predictionId, data) {
    try {
      console.log(`Updating diabetes prediction ${predictionId}:`, data);
      const response = await api.put(`/api/diagnostics/diabetes/prediction/${predictionId}`, data);
      console.log('Update diabetes prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating diabetes prediction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update diabetes prediction');
    }
  }
}

// Create singleton instance
const diagnosticsService = new DiagnosticsService();
export default diagnosticsService;