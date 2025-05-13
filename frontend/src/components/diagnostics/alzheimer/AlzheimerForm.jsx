import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Check, 
  Upload, 
  Image as ImageIcon,
  Brain,
  X,
  Trash2,
  Info,
  Camera
} from 'lucide-react';

const AlzheimerForm = () => {
  const { isDark } = useTheme();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Patient data
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

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

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) {
      setUploadError('');
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should not exceed 10MB');
      return;
    }
    
    setUploadError('');
    setSelectedFile(file);
    
    // Generate image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select an MRI image to upload');
      return;
    }
    
    setError('');
    setPredicting(true);
    setPredictionResult(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const result = await diagnosticsService.predictAlzheimer(patientId, formData);
      console.log("Prediction result received:", result);
      setPredictionResult(result.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || 'Failed to make prediction. Please try again.');
    } finally {
      setPredicting(false);
    }
  };

  // Handle saving prediction with doctor's assessment
  const handleSaveAssessment = async (assessmentClass) => {
    if (!predictionResult || !predictionResult.id) {
      setError('No prediction result to save');
      return;
    }
    
    setLoading(true);
    
    try {
      await diagnosticsService.updateAlzheimerPrediction(predictionResult.id, {
        doctor_assessment: assessmentClass,
        doctor_notes: 'Assessment confirmed by healthcare professional.'
      });
      
      navigate(`/patients/${patientId}/alzheimer-history`);
    } catch (err) {
      setError(err.message || 'Failed to save assessment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };
  
  // Get label for class
  const getClassLabel = (classCode) => {
    const labels = {
      'CN': 'Cognitive Normal (Non Demented)',
      'EMCI': 'Early Mild Cognitive Impairment',
      'LMCI': 'Late Mild Cognitive Impairment',
      'AD': 'Alzheimer\'s Disease (Moderate Dementia)'
    };
    
    return labels[classCode] || classCode;
  };
  
  // Get color based on class
  const getColorForClass = (classCode) => {
    switch (classCode) {
      case 'CN':
        return isDark ? 'text-emerald-400' : 'text-emerald-600';
      case 'EMCI':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'LMCI':
        return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'AD':
        return isDark ? 'text-rose-400' : 'text-rose-600';
      default:
        return isDark ? 'text-slate-300' : 'text-slate-600';
    }
  };
  
  // Get background color based on class
  const getBgColorForClass = (classCode) => {
    switch (classCode) {
      case 'CN':
        return isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200';
      case 'EMCI':
        return isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'LMCI':
        return isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200';
      case 'AD':
        return isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200';
      default:
        return isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-300';
    }
  };

  // Show loading state if patient data is still loading
  if (patientLoading) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin mb-4"></div>
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
          <h1 className="text-2xl font-bold">Alzheimer's Disease Assessment</h1>
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
        
        {/* MRI Upload Form */}
        {!predictionResult ? (
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-500" />
              Upload Brain MRI Image
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div 
                className={`border-dashed border-2 p-6 rounded-lg cursor-pointer text-center transition-colors ${dragActive ? (isDark ? 'border-purple-500 bg-slate-700/50' : 'border-purple-500 bg-purple-50') : (isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-300 hover:border-slate-400')}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleButtonClick}
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={imagePreview} 
                      alt="MRI preview" 
                      className="max-h-64 object-contain mb-4 rounded-lg"
                    />
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className={`w-16 h-16 mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <p className="text-lg font-medium mb-2">Drag and drop an MRI image here</p>
                    <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      - or -
                    </p>
                    <button
                      type="button"
                      className={`px-4 py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded-md transition-colors flex items-center`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select MRI Image
                    </button>
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileInputChange}
                accept="image/*"
              />
              
              {uploadError && (
                <div className="flex items-center text-rose-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {uploadError}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className={`px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600' : 'bg-white hover:bg-slate-100 border-slate-300'} border rounded-md transition-colors flex items-center justify-center`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Image
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={!selectedFile || predicting}
                  className={`px-4 py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded-md transition-colors flex items-center justify-center ${(!selectedFile || predicting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {predicting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze MRI Image
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Prediction Result View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <h2 className="text-xl font-semibold mb-4">Alzheimer's Disease Assessment Results</h2>
            
            {/* Result Card */}
            <div className={`mb-6 p-4 rounded-lg ${getBgColorForClass(predictionResult.predicted_class)} border`}>
              <div className="flex items-center mb-4">
                <div className={`h-12 w-12 rounded-full ${isDark ? 'bg-slate-700' : 'bg-white'} flex items-center justify-center`}>
                  <Brain className={`h-6 w-6 ${getColorForClass(predictionResult.predicted_class)}`} />
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${getColorForClass(predictionResult.predicted_class)}`}>
                    {predictionResult.predicted_class}: {getClassLabel(predictionResult.predicted_class)}
                  </h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Confidence: {formatPercentage(predictionResult.confidence)}
                  </p>
                </div>
              </div>
              
              <div className={`w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${
                    predictionResult.predicted_class === 'CN' ? 'bg-emerald-500' :
                    predictionResult.predicted_class === 'EMCI' ? 'bg-yellow-500' :
                    predictionResult.predicted_class === 'LMCI' ? 'bg-amber-500' :
                    'bg-rose-500'
                  } rounded-full`}
                  style={{ width: `${predictionResult.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0% Confidence</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>100% Confidence</span>
              </div>
            </div>
            
            {/* Probability Distribution */}
            {predictionResult.probabilities && (
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <h3 className="text-lg font-semibold mb-3">Probability Distribution</h3>
                
                {Object.entries(predictionResult.probabilities).map(([classCode, probability]) => (
                  <div key={classCode} className="mb-3">
                    <div className="flex justify-between items-center">
                      <span className={`${getColorForClass(classCode)} font-medium`}>
                        {classCode}: {getClassLabel(classCode)}
                      </span>
                      <span className={`font-medium ${getColorForClass(classCode)}`}>
                        {formatPercentage(probability)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          classCode === 'CN' ? 'bg-emerald-500' :
                          classCode === 'EMCI' ? 'bg-yellow-500' :
                          classCode === 'LMCI' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Analyzed MRI Image</h3>
                <div className={`border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-lg overflow-hidden`}>
                  <img 
                    src={imagePreview} 
                    alt="Analyzed MRI" 
                    className="max-w-full h-auto object-contain mx-auto max-h-64"
                  />
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to={`/patients/${patientId}/alzheimer-history`}
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
              </Link>
              
              <button
                onClick={() => setPredictionResult(null)}
                className={`flex-1 py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                  isDark 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                New Assessment
              </button>
              
              <button
                onClick={() => handleSaveAssessment(predictionResult.predicted_class)}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                  isDark 
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Assessment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlzheimerForm;