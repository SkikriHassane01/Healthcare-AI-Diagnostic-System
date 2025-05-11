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
  Camera
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
    setSelectedPrediction(prediction);
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
                    {/* Additional patient details can be added here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="mb-6">
          {loading ? (
            <div className="text-center py-4">Loading history...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4">No assessment history found.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded ${getBgColorClass(item.classLabel, isDark)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getIconBgClass(item.classLabel)}`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-semibold ${getColorClass(item.classLabel, isDark)}`}>
                        {getShortAssessmentLabel(item.classLabel)}
                      </p>
                      <p className="text-sm">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewPrediction(item)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span className="ml-2">Details</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Prediction Details Modal */}
        {selectedPrediction && (
          <div className="mt-6 p-4 border rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Prediction Details</h3>
            <p><strong>Assessment:</strong> {getAssessmentLabel(selectedPrediction.classLabel)}</p>
            <p><strong>Date:</strong> {formatDate(selectedPrediction.date)}</p>
            {selectedPrediction.confidence !== undefined && (
              <p><strong>Confidence:</strong> {formatPercentage(selectedPrediction.confidence)}</p>
            )}
            <button
              onClick={() => setSelectedPrediction(null)}
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlzheimerHistory;