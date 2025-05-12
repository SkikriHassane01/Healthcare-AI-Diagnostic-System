import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Check, 
  X, 
  BarChart4,
  Heart,
  User,
  Scale,
  TestTube
} from 'lucide-react';

const DiabetesForm = () => {
  const { isDark } = useTheme();
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Patient data
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    hypertension: 0,
    heart_disease: 0,
    smoking_history: 'never',
    bmi: '',
    HbA1c_level: '',
    blood_glucose_level: ''
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
        
        // Pre-fill form with patient data if available
        const newFormData = { ...formData };
        
        // Map gender
        if (response.patient.gender) {
          if (response.patient.gender === 'male') {
            newFormData.gender = 'Male';
          } else if (response.patient.gender === 'female') {
            newFormData.gender = 'Female';
          } else {
            newFormData.gender = 'Other';
          }
        }
        
        // Set age
        if (response.patient.date_of_birth) {
          newFormData.age = response.patient.age;
        }
        
        // Set BMI if height and weight are available
        if (response.patient.height && response.patient.weight) {
          // Height is in cm, weight is in kg, BMI = weight / (height in m)^2
          const heightInMeters = response.patient.height / 100;
          const bmi = response.patient.weight / (heightInMeters * heightInMeters);
          newFormData.bmi = bmi.toFixed(1);
        }
        
        setFormData(newFormData);
      } catch (err) {
        setError('Failed to load patient data. Please try again.');
        console.error(err);
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
    const { name, value, type, checked } = e.target;
    
    // For checkboxes, use the checked property
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    // Check required fields
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      errors.age = 'Age must be a number between 0 and 120';
    }
    
    if (!formData.bmi) {
      errors.bmi = 'BMI is required';
    } else if (isNaN(formData.bmi) || formData.bmi < 10 || formData.bmi > 60) {
      errors.bmi = 'BMI must be a number between 10 and 60';
    }
    
    if (!formData.HbA1c_level) {
      errors.HbA1c_level = 'HbA1c level is required';
    } else if (isNaN(formData.HbA1c_level) || formData.HbA1c_level < 3 || formData.HbA1c_level > 15) {
      errors.HbA1c_level = 'HbA1c level must be a number between 3 and 15';
    }
    
    if (!formData.blood_glucose_level) {
      errors.blood_glucose_level = 'Blood glucose level is required';
    } else if (isNaN(formData.blood_glucose_level) || formData.blood_glucose_level < 50 || formData.blood_glucose_level > 400) {
      errors.blood_glucose_level = 'Blood glucose level must be a number between 50 and 400';
    }
    
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
      const dataForPrediction = {
        gender: formData.gender,
        age: parseFloat(formData.age),
        hypertension: parseInt(formData.hypertension),
        heart_disease: parseInt(formData.heart_disease), 
        smoking_history: formData.smoking_history,
        bmi: parseFloat(formData.bmi),
        HbA1c_level: parseFloat(formData.HbA1c_level),
        blood_glucose_level: parseFloat(formData.blood_glucose_level)
      };
      
      console.log("Sending prediction data:", dataForPrediction);
      
      // Make prediction
      const result = await diagnosticsService.predictDiabetes(patientId, dataForPrediction);
      console.log("Prediction result received:", result);
      setPredictionResult(result.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || 'Failed to make prediction. Please try again.');
    } finally {
      setPredicting(false);
    }
  };
  

  // Handle going back to patient detail
  const handleBack = () => {
    navigate(`/patients/${patientId}`);
  };
  
  // Show loading state if patient data is still loading
  if (patientLoading) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin mb-4"></div>
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
          <h1 className="text-2xl font-bold">Diabetes Assessment</h1>
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
            <h2 className="text-lg font-semibold mb-4">Patient Health Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demographic Information Section */}
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg col-span-2`}>
                  <h3 className={`text-md font-medium mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <User className="mr-2 h-5 w-5" />
                    Demographic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gender */}
                    <div>
                      <label htmlFor="gender" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          isDark
                            ? 'bg-slate-800 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    {/* Age */}
                    <div>
                      <label htmlFor="age" className={`block mb-1 text-sm font-medium ${formErrors.age ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Age (years) *
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          isDark
                            ? 'bg-slate-800 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        } border ${formErrors.age ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {formErrors.age && (
                        <p className="mt-1 text-sm text-rose-500">{formErrors.age}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Medical History Section */}
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg col-span-2`}>
                  <h3 className={`text-md font-medium mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Heart className="mr-2 h-5 w-5" />
                    Medical History
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hypertension */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hypertension"
                        name="hypertension"
                        checked={formData.hypertension === 1}
                        onChange={handleChange}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                      />
                      <label htmlFor="hypertension" className={`ml-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Has hypertension
                      </label>
                    </div>
                    
                    {/* Heart Disease */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="heart_disease"
                        name="heart_disease"
                        checked={formData.heart_disease === 1}
                        onChange={handleChange}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                      />
                      <label htmlFor="heart_disease" className={`ml-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Has heart disease
                      </label>
                    </div>
                  </div>
                  
                  {/* Smoking History */}
                  <div className="mt-4">
                    <label htmlFor="smoking_history" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Smoking History
                    </label>
                    <select
                      id="smoking_history"
                      name="smoking_history"
                      value={formData.smoking_history}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDark
                          ? 'bg-slate-800 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    >
                      <option value="never">Never</option>
                      <option value="former">Former</option>
                      <option value="current">Current</option>
                      <option value="not current">Not current</option>
                      <option value="ever">Ever</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </div>
                
                {/* Physical Metrics Section */}
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg col-span-2`}>
                  <h3 className={`text-md font-medium mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Scale className="mr-2 h-5 w-5" />
                    Physical Metrics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* BMI */}
                    <div>
                      <label htmlFor="bmi" className={`block mb-1 text-sm font-medium ${formErrors.bmi ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        BMI (kg/m²) *
                      </label>
                      <input
                        type="number"
                        id="bmi"
                        name="bmi"
                        value={formData.bmi}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          isDark
                            ? 'bg-slate-800 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        } border ${formErrors.bmi ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        step="0.1"
                      />
                      {formErrors.bmi && (
                        <p className="mt-1 text-sm text-rose-500">{formErrors.bmi}</p>
                      )}
                      <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        BMI is calculated as weight (kg) / height² (m²)
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Lab Results Section */}
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg col-span-2`}>
                  <h3 className={`text-md font-medium mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <TestTube className="mr-2 h-5 w-5" />
                    Lab Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* HbA1c Level */}
                    <div>
                      <label htmlFor="HbA1c_level" className={`block mb-1 text-sm font-medium ${formErrors.HbA1c_level ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        HbA1c Level (%) *
                      </label>
                      <input
                        type="number"
                        id="HbA1c_level"
                        name="HbA1c_level"
                        value={formData.HbA1c_level}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          isDark
                            ? 'bg-slate-800 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        } border ${formErrors.HbA1c_level ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        step="0.1"
                      />
                      {formErrors.HbA1c_level && (
                        <p className="mt-1 text-sm text-rose-500">{formErrors.HbA1c_level}</p>
                      )}
                      <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Normal range: 4% to 5.6%, Prediabetes: 5.7% to 6.4%, Diabetes: 6.5% or higher
                      </p>
                    </div>
                    
                    {/* Blood Glucose Level */}
                    <div>
                      <label htmlFor="blood_glucose_level" className={`block mb-1 text-sm font-medium ${formErrors.blood_glucose_level ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Blood Glucose Level (mg/dL) *
                      </label>
                      <input
                        type="number"
                        id="blood_glucose_level"
                        name="blood_glucose_level"
                        value={formData.blood_glucose_level}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-md ${
                          isDark
                            ? 'bg-slate-800 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        } border ${formErrors.blood_glucose_level ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {formErrors.blood_glucose_level && (
                        <p className="mt-1 text-sm text-rose-500">{formErrors.blood_glucose_level}</p>
                      )}
                      <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Normal fasting: Less than 100 mg/dL, Prediabetes: 100-125 mg/dL, Diabetes: 126 mg/dL or higher
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={predicting}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors font-medium flex items-center justify-center shadow-md"
                >
                  {predicting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Running Prediction...
                    </>
                  ) : (
                    <>
                      <BarChart4 className="w-5 h-5 mr-2" />
                      Run Diabetes Prediction
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Prediction Result View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className="text-xl font-semibold mb-4">Diabetes Prediction Results</h2>
            
            {/* Result Card - FIXED: Using confidence instead of probability */}
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
                    <Check className="h-6 w-6" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${
                    predictionResult.result 
                      ? (isDark ? 'text-rose-400' : 'text-rose-700')
                      : (isDark ? 'text-emerald-400' : 'text-emerald-700')
                  }`}>
                    {predictionResult.result ? 'Diabetes Risk Detected' : 'Low Diabetes Risk'}
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
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0% Risk</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>100% Risk</span>
              </div>
            </div>
            
            {/* Risk Factors */}
            {predictionResult.risk_factors && predictionResult.risk_factors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg p-4`}>
                  <ul className="space-y-3">
                    {predictionResult.risk_factors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full ${
                          factor.level === 'high' 
                            ? 'bg-rose-500' 
                            : factor.level === 'medium' 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                        }`}></div>
                        <div className="ml-3">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {factor.factor === 'bmi' ? 'BMI' : 
                             factor.factor === 'HbA1c_level' ? 'HbA1c Level' :
                             factor.factor === 'blood_glucose_level' ? 'Blood Glucose Level' :
                             factor.factor.charAt(0).toUpperCase() + factor.factor.slice(1)}:
                            <span className={`font-normal ${isDark ? 'text-slate-300' : 'text-slate-700'} ml-1`}>
                              {factor.value}
                            </span>
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{factor.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Return to Assessment Button */}
            <button
              onClick={() => setPredictionResult(null)}
              className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              Edit Assessment Data
            </button>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default DiabetesForm;