import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import patientService from '../../../services/patient.service';
import diagnosticsService from '../../../services/diagnostics.service';
import { 
  ArrowLeft, 
  BarChart4, 
  AlertCircle, 
  Check, 
  Calendar, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const DiabetesHistory = () => {
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
        const historyResponse = await diagnosticsService.getDiabetesHistory(patientId);
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
            <h1 className="text-2xl font-bold">Diabetes Assessment History</h1>
          </div>
          
          <Link
            to={`/patients/${patientId}/diabetes-assessment`}
            className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
          >
            <BarChart4 className="w-5 h-5 mr-2" />
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
            <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin mb-4"></div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading prediction history...</p>
          </div>
        ) : selectedPrediction ? (
          // Prediction Detail View
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6`}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedPrediction(null)}
                className={`flex items-center text-sm font-medium ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'} transition-colors`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to History
              </button>
              
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Calendar className="w-4 h-4 inline-block mr-1" />
                {formatDate(selectedPrediction.created_at)}
              </div>
            </div>
            
            {/* Prediction Result Card - FIXED: Using confidence instead of probability */}
            <div className={`mb-6 p-4 rounded-lg ${
              selectedPrediction.prediction_result 
                ? (isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-200') 
                : (isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200')
            } border`}>
              <div className="flex items-center mb-4">
                {selectedPrediction.prediction_result ? (
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
                    selectedPrediction.prediction_result 
                      ? (isDark ? 'text-rose-400' : 'text-rose-700')
                      : (isDark ? 'text-emerald-400' : 'text-emerald-700')
                  }`}>
                    {selectedPrediction.prediction_result ? 'Diabetes Risk Detected' : 'Low Diabetes Risk'}
                  </h3>
                  <div className="flex mt-1">
                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mr-4`}>
                      Confidence: {(selectedPrediction.prediction_probability * 100).toFixed(1)}%
                    </p>
                    
                    {/* Show doctor's assessment if available */}
                    {selectedPrediction.doctor_assessment !== null && (
                      <p className={`font-medium ${
                        selectedPrediction.doctor_assessment 
                          ? (isDark ? 'text-rose-400' : 'text-rose-700')
                          : (isDark ? 'text-emerald-400' : 'text-emerald-700')
                      }`}>
                        Doctor's Assessment: 
                        <span className="ml-1">
                          {selectedPrediction.doctor_assessment ? 'Confirmed' : 'Ruled Out'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${selectedPrediction.prediction_result ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}
                  style={{ width: `${selectedPrediction.prediction_probability * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0% Risk</span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>100% Risk</span>
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
            
            {/* Risk Factors */}
            {selectedPrediction.risk_factors && selectedPrediction.risk_factors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg p-4`}>
                  <ul className="space-y-3">
                    {selectedPrediction.risk_factors.map((factor, index) => (
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
            
            {/* Input Data */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Assessment Data</h3>
              <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gender</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.gender}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Age</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.age} years</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hypertension</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.hypertension === 1 ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Heart Disease</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.heart_disease === 1 ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Smoking History</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedPrediction.input_data.smoking_history.charAt(0).toUpperCase() + selectedPrediction.input_data.smoking_history.slice(1)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>BMI</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.bmi} kg/m²</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HbA1c Level</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.HbA1c_level}%</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Blood Glucose Level</p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedPrediction.input_data.blood_glucose_level} mg/dL</p>
                </div>
              </div>
            </div>
          </div>
        ) : history.length === 0 ? (
          // No history message
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-6 mb-6 text-center`}>
            <div className="py-8">
              <BarChart4 className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className="text-lg font-semibold mb-2">No Assessment History</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                This patient does not have any diabetes assessments yet.
              </p>
              <Link
                to={`/patients/${patientId}/diabetes-assessment`}
                className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
              >
                <BarChart4 className="w-5 h-5 mr-2" />
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
                      {prediction.prediction_result ? (
                        <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mr-4">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium">
                          {prediction.prediction_result ? 'Diabetes Risk' : 'Low Risk'}
                          
                          {/* Show doctor's assessment if available */}
                          {prediction.doctor_assessment !== null && (
                            <span className={`ml-2 text-sm font-normal ${
                              prediction.doctor_assessment 
                                ? (isDark ? 'text-rose-400' : 'text-rose-600')
                                : (isDark ? 'text-emerald-400' : 'text-emerald-600')
                            }`}>
                              (Doctor {prediction.doctor_assessment ? 'Confirmed' : 'Ruled Out'})
                            </span>
                          )}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Calendar className="w-3.5 h-3.5 inline-block mr-1" />
                          {formatDate(prediction.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-right">
                          <span className={`font-medium ${
                            prediction.prediction_result 
                              ? (isDark ? 'text-rose-400' : 'text-rose-600')
                              : (isDark ? 'text-emerald-400' : 'text-emerald-600')
                          }`}>
                            {/* FIXED: Display probability as confidence percentage */}
                            {(prediction.prediction_probability * 100).toFixed(1)}%
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

export default DiabetesHistory;