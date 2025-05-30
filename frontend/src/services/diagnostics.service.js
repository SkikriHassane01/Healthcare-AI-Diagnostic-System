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
      // Log the data being sent to API for debugging
      console.log(`Making diabetes prediction for patient ${patientId}:`, data);
      
      // Ensure all required fields are properly formatted
      const formattedData = {
        gender: data.gender,
        age: parseFloat(data.age),
        hypertension: parseInt(data.hypertension),
        heart_disease: parseInt(data.heart_disease),
        smoking_history: data.smoking_history,
        bmi: parseFloat(data.bmi),
        HbA1c_level: parseFloat(data.HbA1c_level),
        blood_glucose_level: parseFloat(data.blood_glucose_level)
      };
      
      // Make API request with formatted data
      const response = await api.post(`/api/diagnostics/diabetes/predict/${patientId}`, formattedData);
      console.log('Diabetes prediction response:', response.data);
      return response.data;
    } catch (error) {
      // More detailed error logging
      if (error.response) {
        console.error('Error making diabetes prediction:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(error.response.data?.message || 'Failed to make diabetes prediction');
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        throw new Error('No response received from server');
      } else {
        console.error('Error making diabetes prediction:', error.message);
        throw new Error('Error sending request: ' + error.message);
      }
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
  /**TODO: ______________________Breast Cancer______________________*/
  /**
   * Make a breast cancer prediction for a patient
   * @param {string} patientId - ID of the patient
   * @param {Object} data - Prediction data
   * @returns {Promise} API response with prediction result
   */
  async predictBreastCancer(patientId, data) {
    try {
      console.log(`Making breast cancer prediction for patient ${patientId}:`, data);
      
      // Format data if needed
      const formattedData = {};
      for (const key in data) {
        formattedData[key] = isNaN(parseFloat(data[key])) ? data[key] : parseFloat(data[key]);
      }
      
      const response = await api.post(`/api/diagnostics/breast-cancer/predict/${patientId}`, formattedData);
      console.log('Breast cancer prediction response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error making breast cancer prediction:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(error.response.data?.message || 'Failed to make breast cancer prediction');
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        throw new Error('No response received from server');
      } else {
        console.error('Error making breast cancer prediction:', error.message);
        throw new Error('Error sending request: ' + error.message);
      }
    }
  }

  /**
   * Get breast cancer prediction history for a patient
   * @param {string} patientId - ID of the patient
   * @returns {Promise} API response with prediction history
   */
  async getBreastCancerHistory(patientId) {
    try {
      const response = await api.get(`/api/diagnostics/breast-cancer/history/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting breast cancer history:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get breast cancer prediction history');
    }
  }

  /**
   * Get a specific breast cancer prediction
   * @param {string} predictionId - ID of the prediction
   * @returns {Promise} API response with prediction details
   */
  async getBreastCancerPrediction(predictionId) {
    try {
      const response = await api.get(`/api/diagnostics/breast-cancer/prediction/${predictionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting breast cancer prediction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get breast cancer prediction');
    }
  }

  /**
   * Update a breast cancer prediction with doctor's assessment
   * @param {string} predictionId - ID of the prediction
   * @param {Object} data - Update data including doctor's assessment
   * @returns {Promise} API response with updated prediction
   */
  async updateBreastCancerPrediction(predictionId, data) {
    try {
      console.log(`Updating breast cancer prediction ${predictionId}:`, data);
      
      // Ensure we have a valid prediction ID
      if (!predictionId) {
        throw new Error('Invalid prediction ID');
      }
      
      const response = await api.put(`/api/diagnostics/breast-cancer/prediction/${predictionId}`, data);
      console.log('Update breast cancer prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating breast cancer prediction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update breast cancer prediction');
    }
  }

  /** TODO: ______________________Alzheimer's______________________*/
  /**
 * Make an Alzheimer's prediction for a patient
 * @param {string} patientId - ID of the patient
 * @param {FormData} formData - Form data containing the image
 * @returns {Promise} API response with prediction result
 */
async predictAlzheimer(patientId, formData) {
  try {
    console.log(`Making Alzheimer prediction for patient ${patientId}`);
    const response = await api.post(`/api/diagnostics/alzheimer/predict/${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Alzheimer prediction response:", response.data);
    return response.data;
  } catch (error) {
    // More detailed error logging
    if (error.response) {
      console.error('Error making Alzheimer prediction:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(error.response.data?.message || 'Failed to make Alzheimer prediction');
    } else if (error.request) {
      console.error('No response received from server:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error making Alzheimer prediction:', error.message);
      throw new Error('Error sending request: ' + error.message);
    }
  }
}

/**
 * Get Alzheimer's prediction history for a patient
 * @param {string} patientId - ID of the patient
 * @returns {Promise} API response with prediction history
 */
async getAlzheimerHistory(patientId) {
  try {
    const response = await api.get(`/api/diagnostics/alzheimer/history/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Alzheimer history:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get Alzheimer prediction history');
  }
}

/**
 * Get a specific Alzheimer's prediction
 * @param {string} predictionId - ID of the prediction
 * @returns {Promise} API response with prediction details
 */
async getAlzheimerPrediction(predictionId) {
  try {
    const response = await api.get(`/api/diagnostics/alzheimer/prediction/${predictionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Alzheimer prediction:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get Alzheimer prediction');
  }
}

/**
 * Update an Alzheimer's prediction with doctor's assessment
 * @param {string} predictionId - ID of the prediction
 * @param {Object} data - Update data including doctor's assessment
 * @returns {Promise} API response with updated prediction
 */
async updateAlzheimerPrediction(predictionId, data) {
  try {
    console.log(`Updating Alzheimer prediction ${predictionId}:`, data);
    const response = await api.put(`/api/diagnostics/alzheimer/prediction/${predictionId}`, data);
    console.log('Update Alzheimer prediction response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating Alzheimer prediction:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update Alzheimer prediction');
  }
}
}

// Create singleton instance
const diagnosticsService = new DiagnosticsService();
export default diagnosticsService;