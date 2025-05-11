import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        doctor_notes: ''
      });
      navigate(`/patients/${patientId}`);
    } catch (err) {
      setError(err.message || 'Failed to save assessment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to patient detail
  const handleBack = () => {
    navigate(`/patients/${patientId}`);
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };

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
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className={`mr-4 p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Alzheimer's Disease Assessment</h1>
        </div>
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
                    Gender: {patient.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div 
              className={`border-dashed border-2 p-4 rounded-lg cursor-pointer ${dragActive ? (isDark ? 'border-sky-500' : 'border-blue-500') : (isDark ? 'border-slate-600' : 'border-slate-300')}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Uploaded preview" className="max-h-64 mx-auto" />
              ) : (
                <div className="text-center">
                  <p className="mb-2">Drag and drop an MRI image here, or click to select a file</p>
                  <Camera className="mx-auto w-8 h-8" />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileInputChange} />
            {uploadError && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" disabled={predicting}>
                <Upload className="w-5 h-5" />
                {predicting ? 'Predicting...' : 'Analyze MRI'}
              </button>
              {selectedFile && (
                <button type="button" onClick={handleClearFile} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                  <Trash2 className="w-5 h-5" />
                  Clear Image
                </button>
              )}
            </div>
          </form>
        </div>
        {error && (
          <div className="mb-4 text-red-500 flex items-center gap-1">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {predictionResult && (
          <div className="mb-6 p-4 border rounded-lg shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              <span className="text-lg">Prediction Result: {predictionResult.result_text || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <span className="text-sm">Confidence: {formatPercentage(predictionResult.confidence || 0)}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleSaveAssessment('normal')} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <Check className="w-5 h-5" />
                Save as Normal
              </button>
              <button onClick={() => handleSaveAssessment('abnormal')} className="flex items-center gap-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                <AlertCircle className="w-5 h-5" />
                Save as Abnormal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlzheimerForm;