import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Heart,
  HeartPulse,
  User,
  FileBarChart2
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';

const featureRanges = {
  radius_mean: { min: 5, max: 30 },
  texture_mean: { min: 5, max: 50 },
  perimeter_mean: { min: 40, max: 200 },
  area_mean: { min: 100, max: 2500 },
  smoothness_mean: { min: 0.05, max: 0.2 },
  compactness_mean: { min: 0.01, max: 0.5 },
  concavity_mean: { min: 0, max: 0.5 },
  concave_points_mean: { min: 0, max: 0.3 },
  symmetry_mean: { min: 0.1, max: 0.4 },
  fractal_dimension_mean: { min: 0.04, max: 0.1 }
};
const BreastCancerForm = () => {
  const { isDark } = useTheme();
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Patient data
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    radius_mean: '',
    texture_mean: '',
    perimeter_mean: '',
    area_mean: '',
    smoothness_mean: '',
    compactness_mean: '',
    concavity_mean: '',
    concave_points_mean: '',
    symmetry_mean: '',
    fractal_dimension_mean: ''
  });
  
  // Form validation
  const [formErrors, setFormErrors] = useState({});
  
  // API state
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  
  // Load patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setPatientLoading(true);
        const response = await patientService.getPatient(patientId);
        setPatient(response.patient);
        setError('');
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError(err.message || 'Failed to load patient data');
      } finally {
        setPatientLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Check all required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        errors[key] = 'This field is required';
      } else if (isNaN(parseFloat(value))) {
        errors[key] = 'Must be a number';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Reset states
    setError('');
    setPredicting(true);
    setPredictionResult(null);
    
    try {
      // Make sure all fields are properly formatted for the backend
      const dataForPrediction = {};
      Object.entries(formData).forEach(([key, value]) => {
        dataForPrediction[key] = parseFloat(value);
      });
      
      console.log("Sending prediction data:", dataForPrediction);
      
      // Make prediction
      const result = await diagnosticsService.predictBreastCancer(patientId, dataForPrediction);
      console.log("Prediction result received:", result);
      setPredictionResult(result.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || 'Failed to make prediction. Please try again.');
    } finally {
      setPredicting(false);
    }
  };
  
  // Load sample data for testing
  const loadSampleData = () => {
    setFormData({
      radius_mean: '17.99',
      texture_mean: '10.38',
      perimeter_mean: '122.8',
      area_mean: '1001',
      smoothness_mean: '0.1184',
      compactness_mean: '0.2776',
      concavity_mean: '0.3001',
      concave_points_mean: '0.1471',
      symmetry_mean: '0.2419',
      fractal_dimension_mean: '0.07871'
    });
    setFormErrors({});
  };

  // Save assessment to patient records
  const saveToPatientRecords = async () => {
    try {
      setLoading(true);
      
      if (!predictionResult || !predictionResult.id) {
        throw new Error('No valid prediction ID found');
      }
      
      // Call the API to update the prediction with doctor's assessment
      await diagnosticsService.updateBreastCancerPrediction(predictionResult.id, {
        doctor_assessment: predictionResult.result ? 'malignant' : 'benign',
        doctor_notes: 'Assessment confirmed by healthcare professional.'
      });
      
      navigate(`/patients/${patientId}/breast-cancer-history`);
    } catch (err) {
      setError(err.message || 'Failed to save assessment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  // Format feature name for display
  const formatFeatureName = (name) => {
    return name
      .replace('_mean', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state if patient data is still loading
  if (patientLoading) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-pink-500 rounded-full animate-spin mb-4"></div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading patient data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className={`mr-4 p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Breast Cancer Assessment</h1>
        </div>
        
        {/* Patient info card */}
        {patient && (
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 mb-6`}>
            <div className="flex items-center">
              <div className={`h-12 w-12 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg font-bold">
                  {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{patient.full_name}</h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Age: {patient.age}
                  </div>
                  <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Gender: {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Assessment Form */}
        {!predictionResult ? (
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <HeartPulse className="mr-2 h-5 w-5 text-pink-600" />
              Fine Needle Aspiration (FNA) Test Data
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={loadSampleData}
                  className={`text-sm px-3 py-1 ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  } rounded flex items-center`}
                >
                  Load Sample Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className={`block text-sm font-medium mb-1 ${
                      formErrors[field] ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {formatFeatureName(field)} *
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      formErrors[field]
                        ? 'border-rose-500'
                        : isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300'
                    } border focus:outline-none focus:ring-2 focus:ring-pink-500`}
                    placeholder={`Enter ${formatFeatureName(field).toLowerCase()}`}
                  />
                  {formErrors[field] && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors[field]}</p>
                  )}
                  {/* Add this part to display the valid range */}
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Valid range: {featureRanges[field].min} to {featureRanges[field].max}
                  </p>
                </div>
              ))}
            </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={predicting}
                  className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors font-medium flex items-center justify-center shadow-md"
                >
                  {predicting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Running Prediction...
                    </>
                  ) : (
                    <>
                      <FileBarChart2 className="w-5 h-5 mr-2" />
                      Run Breast Cancer Prediction
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Prediction Result View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className="text-xl font-semibold mb-4">Breast Cancer Prediction Results</h2>
            
            {/* Result Card */}
            <div className={`mb-6 p-4 rounded-lg ${
              predictionResult.result 
                ? (isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200') 
                : (isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200')
            } border`}>
              <div className="flex items-center mb-4">
                {predictionResult.result ? (
                  <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${
                    predictionResult.result 
                      ? (isDark ? 'text-rose-400' : 'text-rose-700')
                      : (isDark ? 'text-emerald-400' : 'text-emerald-700')
                  }`}>
                    {predictionResult.result ? 'Malignant (Cancerous)' : 'Benign (Non-Cancerous)'}
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Confidence: {(predictionResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className={`w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${predictionResult.result ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}
                  style={{ width: `${predictionResult.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0% Confidence</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>100% Confidence</span>
              </div>
            </div>
            
            {/* Input Data Summary */}
            <div className={`mb-6 p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg`}>
              <h3 className="text-lg font-semibold mb-2">Analyzed Data Values</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {formatFeatureName(key)}:
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => navigate(`/patients/${patientId}/breast-cancer-history`)}
              className={`flex-1 py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </button>
            
            <button
              onClick={() => setPredictionResult(null)}
              className={`flex-1 py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                isDark 
                  ? 'bg-pink-700 hover:bg-pink-600 text-white' 
                  : 'bg-pink-600 hover:bg-pink-500 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Assessment
            </button>
            
            <button
              onClick={() => {
                // Automatically save the prediction result first
                if (predictionResult && predictionResult.id) {
                  diagnosticsService.updateBreastCancerPrediction(predictionResult.id, {
                    doctor_assessment: predictionResult.result ? 'malignant' : 'benign',
                    doctor_notes: 'Assessment confirmed by healthcare professional.'
                  }).catch(err => console.error('Error saving assessment:', err));
                }
                
                // Reset form regardless of save success/failure
                setPredictionResult(null);
                setFormData({
                  radius_mean: '',
                  texture_mean: '',
                  perimeter_mean: '',
                  area_mean: '',
                  smoothness_mean: '',
                  compactness_mean: '',
                  concavity_mean: '',
                  concave_points_mean: '',
                  symmetry_mean: '',
                  fractal_dimension_mean: ''
                });
              }}
              className={`flex-1 py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                isDark 
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Assessment
            </button>
            </div>
          </div> 
        )}
      </div>
    </div>
  );
};

export default BreastCancerForm;