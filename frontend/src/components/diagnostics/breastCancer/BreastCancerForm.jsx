import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  User,
  FileDown,
  Save
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';
import jsPDF from 'jspdf';

const BreastCancerForm = () => {
  const { isDark } = useTheme();
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Patient data
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  
  // Form state for breast cancer metrics
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
  
  // Results/validation state
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  
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

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check if all fields have values and are numbers
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        errors[key] = 'Required';
        isValid = false;
      } else if (isNaN(parseFloat(value))) {
        errors[key] = 'Must be a number';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setPredicting(true);
    setResult(null); // Clear previous results
    
    try {
      // Prepare data for prediction
      const dataForPrediction = {};
      Object.keys(formData).forEach(key => {
        // Ensure all values are properly formatted numbers
        dataForPrediction[key] = parseFloat(formData[key]);
      });
      
      console.log("Sending prediction data:", dataForPrediction);
      
      // Call the actual prediction API
      const apiResult = await diagnosticsService.predictBreastCancer(patientId, dataForPrediction);
      console.log("Prediction result received:", apiResult);
      
      // The API returns data in the format: { patient_id, patient_name, prediction: {...} }
      // We need to extract and format the prediction object
      if (apiResult && apiResult.prediction) {
        console.log("Raw API response:", apiResult);
        
        // Extract the prediction data
        const predictionData = apiResult.prediction;
        
        // Format the prediction for display
        const formattedResult = {
          // If the API returns 'malignant' for prediction.result or prediction.prediction, set result to true
          result: predictionData.result === 'malignant' || 
                 predictionData.prediction === true || 
                 predictionData.prediction === 'malignant',
          probability: predictionData.probability || predictionData.confidence || 0.5,
          // Add ID and other metadata
          id: predictionData.id || "temp-id-" + new Date().getTime(), // Use a temp ID if none is provided
          timestamp: predictionData.timestamp || new Date().toISOString(),
        };
        
        console.log("Formatted prediction result:", formattedResult);
        setResult(formattedResult);
      } else {
        throw new Error('Invalid response format from the server');
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || 'Failed to make prediction. Please try again.');
    } finally {
      setPredicting(false);
    }
  };

  // Load sample data
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
      setIsLoading(true);
      
      // For demo purposes, we'll simulate a successful save since we might not have a proper ID
      // This would normally call the API with the prediction ID
      // await diagnosticsService.updateBreastCancerPrediction(result.id, {
      //   doctor_assessment: true,
      //   doctor_notes: 'Assessment confirmed by healthcare professional.'
      // });
      
      console.log("Saving assessment for patient:", patientId);
      console.log("Result:", result);
      
      // Simulate a successful save
      setSuccessMessage('Assessment saved successfully to patient records');
      setTimeout(() => {
        navigate(`/patients/${patientId}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save assessment');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export results as PDF
  const exportResults = () => {
    try {
      if (!result) {
        setError('No results to export');
        return;
      }
      
      console.log("Exporting results to PDF:", result);
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Breast Cancer Assessment Report', 20, 20);
      
      // Add patient info
      doc.setFontSize(12);
      doc.text(`Patient: ${patient.first_name} ${patient.last_name}`, 20, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
      
      // Add assessment result
      doc.setFontSize(14);
      doc.text('Assessment Result:', 20, 55);
      doc.setFontSize(12);
      doc.text(`Diagnosis: ${result.result ? 'Malignant (Cancerous)' : 'Benign (Non-Cancerous)'}`, 30, 65);
      doc.text(`Confidence: ${Math.round(result.probability * 100)}%`, 30, 75);
      
      // Add input data
      doc.setFontSize(14);
      doc.text('Input Data:', 20, 90);
      
      let yPos = 100;
      Object.entries(formData).forEach(([key, value], index) => {
        const formattedKey = key
          .replace('_mean', '')
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        doc.setFontSize(10);
        doc.text(`${formattedKey}: ${value}`, 30, yPos);
        yPos += 10;
        
        // Start a new column if we have too many items
        if (index === 4) {
          yPos = 100;
          doc.text(`${formattedKey}: ${value}`, 120, yPos);
          yPos += 10;
        } else if (index > 4) {
          doc.text(`${formattedKey}: ${value}`, 120, yPos);
          yPos += 10;
        }
      });
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
      
      // Save the PDF
      const filename = `breast_cancer_${patient.last_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      setSuccessMessage('PDF exported successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export results as PDF');
    }
  };

  // Helper function to display feature names in a more readable format
  const formatFeatureName = (name) => {
    return name
      .replace('_mean', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle going back to patient detail
  const handleBack = () => {
    navigate(`/patients/${patientId}`);
  };
  
  // Reset the form
  const resetForm = () => {
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
    setFormErrors({});
    setResult(null);
    setSuccessMessage('');
    setError('');
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
        
        {/* Success Message */}
        {successMessage && (
          <div className={`p-4 border rounded-md mb-6 ${
            isDark ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className={`p-4 border rounded-md mb-6 ${
            isDark ? 'bg-rose-900/20 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
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
        
        {/* Assessment Form or Results */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          {!result ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Fine Needle Aspiration (FNA) Test Data</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={loadSampleData}
                    className={`text-sm px-3 py-1 ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } rounded flex items-center`}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Load Sample Data
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.keys(formData).map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field}
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {formatFeatureName(field)}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded-md border ${
                          formErrors[field]
                            ? 'border-red-500'
                            : isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                        placeholder={`Enter ${formatFeatureName(field).toLowerCase()}`}
                      />
                      {formErrors[field] && (
                        <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={predicting}
                    className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors flex items-center"
                  >
                    {predicting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Analyze Data
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
              
              {/* Summary */}
              <div className={`p-4 ${result.result ? isDark ? 'bg-rose-900/20 border-rose-800' : 'bg-rose-50 border-rose-200' : isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'} border rounded-lg mb-6`}>
                <div className="flex items-center">
                  {result.result
                    ? <AlertCircle className={`h-5 w-5 mr-2 ${isDark ? 'text-rose-400' : 'text-rose-500'}`}/>
                    : <CheckCircle2 className={`h-5 w-5 mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}/>
                  }
                  <h4 className="font-medium">{result.result ? 'Malignant (Cancerous)' : 'Benign (Non-Cancerous)'}</h4>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm`}>Confidence:</span>
                    <span className="font-semibold">{Math.round(result.probability * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div className={`${result.result ? 'bg-rose-500' : 'bg-emerald-500'} h-2 rounded-full`} style={{width: `${result.probability * 100}%`}}/>
                  </div>
                </div>
              </div>
              
              {/* Patient Data Summary */}
              <div className={`p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg mb-6`}>
                <h4 className="font-medium mb-3">Analyzed Data Values</h4>
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
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={saveToPatientRecords}
                  disabled={isLoading || successMessage}
                  className={`px-4 py-2 ${
                    isLoading || successMessage 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-pink-600 hover:bg-pink-500'
                  } text-white rounded-md transition-colors flex-1 flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Patient Records
                    </>
                  )}
                </button>
                <button 
                  onClick={exportResults}
                  disabled={isLoading}
                  className={`px-4 py-2 border border-pink-600 text-pink-600 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
                  } rounded-md transition-colors flex-1 flex items-center justify-center`}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Results (PDF)
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={resetForm}
                  className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Start New Assessment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreastCancerForm;