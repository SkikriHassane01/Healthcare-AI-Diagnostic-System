import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';
import { 
  ArrowLeft, 
  Brain, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  Camera,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const AlzheimerHistory = () => {
  const { isDark } = useTheme();
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // Patient data
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  
  // History data
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selected prediction for viewing details
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  
  // Load patient data and prediction history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient data
        const patientResponse = await patientService.getPatient(patientId);
        setPatient(patientResponse.patient);
        
        // Fetch prediction history
        const historyResponse = await diagnosticsService.getAlzheimerHistory(patientId);
        setHistory(historyResponse.history || []);
        
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load patient data or prediction history.');
        console.error(err);
      } finally {
        setLoading(false);
        setPatientLoading(false);
      }
    };
    
    if (patientId) {
      fetchData();
    }
  }, [patientId]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date format error';
    }
  };
  
  // Format percentage for display
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };
  
  // Get color class based on prediction class
  const getColorClass = (classLabel, isDark = false) => {
    switch (classLabel) {
      case 'CN':
        return isDark ? 'text-emerald-400' : 'text-emerald-700';
      case 'EMCI':
        return isDark ? 'text-yellow-400' : 'text-yellow-700';
      case 'LMCI':
        return isDark ? 'text-amber-400' : 'text-amber-700';
      case 'AD':
        return isDark ? 'text-rose-400' : 'text-rose-700';
      default:
        return isDark ? 'text-slate-400' : 'text-slate-700';
    }
  };
  
  // Get background color class based on prediction class
  const getBgColorClass = (classLabel, isDark = false) => {
    switch (classLabel) {
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
  
  // Get icon background color class
  const getIconBgClass = (classLabel) => {
    switch (classLabel) {
      case 'CN':
        return 'bg-emerald-100 text-emerald-600';
      case 'EMCI':
        return 'bg-yellow-100 text-yellow-600';
      case 'LMCI':
        return 'bg-amber-100 text-amber-600';
      case 'AD':
        return 'bg-rose-100 text-rose-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };
  
  // Get assessment label
  const getAssessmentLabel = (classLabel) => {
    switch (classLabel) {
      case 'CN':
        return 'Cognitive Normal (Non Demented)';
      case 'EMCI':
        return 'Early Mild Cognitive Impairment (Very Mild Dementia)';
      case 'LMCI':
        return 'Late Mild Cognitive Impairment (Mild Dementia)';
      case 'AD':
        return 'Alzheimer\'s Disease (Moderate Dementia)';
      default:
        return 'Unknown Assessment';
    }
  };
  
  // Get short assessment label
  const getShortAssessmentLabel = (classLabel) => {
    switch (classLabel) {
      case 'CN':
        return 'Cognitive Normal';
      case 'EMCI':
        return 'Early MCI';
      case 'LMCI':
        return 'Late MCI';
      case 'AD':
        return 'Alzheimer\'s Disease';
      default:
        return 'Unknown';
    }
  };
  
  // Handle viewing a prediction's details
  const handleViewPrediction = (prediction) => {
    // Convert from API format to detailed view format if necessary
    const detailedPrediction = {
      ...prediction,
      created_at: prediction.date,
      confidence: prediction.confidence,
      prediction_class: prediction.classLabel,
      doctor_assessment: prediction.doctor_assessment,
      doctor_notes: prediction.doctor_notes
    };
    
    setSelectedPrediction(detailedPrediction);
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className={`mr-4 p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Alzheimer's Assessment History</h1>
          </div>
          
          <Link
            to={`/patients/${patientId}/alzheimer-assessment`}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md shadow-md transition-colors"
          >
            <Brain className="w-5 h-5 mr-2" />
            New Assessment
          </Link>
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
        
        {/* Content Area */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading prediction history...</p>
          </div>
        ) : selectedPrediction ? (
          // Prediction Detail View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedPrediction(null)}
                className={`flex items-center text-sm font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition-colors`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to History
              </button>
              
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Calendar className="w-4 h-4 inline-block mr-1" />
                {formatDate(selectedPrediction.created_at)}
              </div>
            </div>
            
            {/* Prediction Result Card */}
            <div className={`mb-6 p-4 rounded-lg ${getBgColorClass(selectedPrediction.prediction_class, isDark)} border`}>
              <div className="flex items-center mb-4">
                <div className={`h-12 w-12 rounded-full ${getIconBgClass(selectedPrediction.prediction_class)} flex items-center justify-center`}>
                  <Brain className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-semibold ${getColorClass(selectedPrediction.prediction_class, isDark)}`}>
                    {getShortAssessmentLabel(selectedPrediction.prediction_class)}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {getAssessmentLabel(selectedPrediction.prediction_class)}
                  </p>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mt-1`}>
                    Confidence: {formatPercentage(selectedPrediction.confidence)}
                  </p>
                </div>
              </div>
              
              <div className={`w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full rounded-full ${
                    selectedPrediction.prediction_class === 'CN' ? 'bg-emerald-500' :
                    selectedPrediction.prediction_class === 'EMCI' ? 'bg-yellow-500' :
                    selectedPrediction.prediction_class === 'LMCI' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${selectedPrediction.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0% Confidence</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>100% Confidence</span>
              </div>
            </div>
            
            {/* Doctor's Notes */}
            {selectedPrediction.doctor_notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Doctor's Notes</h3>
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg p-4`}>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedPrediction.doctor_notes}
                  </p>
                </div>
              </div>
            )}
            
            {/* Doctor's Assessment (if different from prediction) */}
            {selectedPrediction.doctor_assessment && selectedPrediction.doctor_assessment !== selectedPrediction.prediction_class && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Doctor's Assessment</h3>
                <div className={`${getBgColorClass(selectedPrediction.doctor_assessment, isDark)} rounded-lg p-4 border`}>
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full ${getIconBgClass(selectedPrediction.doctor_assessment)} flex items-center justify-center mr-4`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${getColorClass(selectedPrediction.doctor_assessment, isDark)}`}>
                        {getShortAssessmentLabel(selectedPrediction.doctor_assessment)}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {getAssessmentLabel(selectedPrediction.doctor_assessment)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setSelectedPrediction(null)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to History
              </button>
              
              <Link
                to={`/patients/${patientId}/alzheimer-assessment`}
                className={`flex-1 py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center ${
                  isDark 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                <Camera className="w-5 h-5 mr-2" />
                New Assessment
              </Link>
            </div>
          </div>
        ) : history.length === 0 ? (
          // No history message
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6 text-center`}>
            <div className="py-8">
              <Brain className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className="text-lg font-semibold mb-2">No Assessment History</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                This patient does not have any Alzheimer's assessments yet.
              </p>
              <Link
                to={`/patients/${patientId}/alzheimer-assessment`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md shadow-md transition-colors"
              >
                <Brain className="w-5 h-5 mr-2" />
                Create First Assessment
              </Link>
            </div>
          </div>
        ) : (
          // History List View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border overflow-hidden mb-6`}>
            <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} px-6 py-3 border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <h3 className="font-semibold">Assessment History</h3>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {history.map((prediction) => (
                <div 
                  key={prediction.id}
                  className={`px-6 py-4 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors cursor-pointer`}
                  onClick={() => handleViewPrediction(prediction)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${getIconBgClass(prediction.classLabel)} flex items-center justify-center mr-4`}>
                        <Brain className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">
                          {getShortAssessmentLabel(prediction.classLabel)}
                          
                          {/* Show doctor's assessment if different */}
                          {prediction.doctor_assessment && prediction.doctor_assessment !== prediction.classLabel && (
                            <span className={`ml-2 text-sm font-normal ${getColorClass(prediction.doctor_assessment, isDark)}`}>
                              (Doctor: {getShortAssessmentLabel(prediction.doctor_assessment)})
                            </span>
                          )}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Calendar className="w-3.5 h-3.5 inline-block mr-1" />
                          {formatDate(prediction.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-right">
                          <span className={`font-medium ${getColorClass(prediction.classLabel, isDark)}`}>
                            {formatPercentage(prediction.confidence)}
                          </span>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Confidence
                          </p>
                        </div>
                      </div>
                      
                      <ChevronRight className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlzheimerHistory;