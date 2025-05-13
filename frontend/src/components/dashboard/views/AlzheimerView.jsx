import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../../../services/patient.service';
import { 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Search,
  User,
  Calendar,
  Users,
  Brain,
  FileText,
  FileDown,
  Printer,
  Camera
} from 'lucide-react';

const AlzheimerView = ({ isDark, setActiveTab }) => {
  const navigate = useNavigate();
  
  // State variables for patient selection
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientError, setPatientError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview'); // 'overview', 'patients'

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatients();
        if (response && response.patients) {
          setPatients(response.patients);
        } else {
          setPatientError('Failed to load patients data');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setPatientError(err.message || 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter patients based on search term
  const filteredPatients = searchTerm.trim() === '' 
    ? patients 
    : patients.filter(patient => {
        const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
        const email = (patient.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
  
  // Navigate to patient assessment
  const handlePatientSelect = (patient) => {
    // Direct navigation to the Alzheimer assessment form for this patient
    navigate(`/patients/${patient.id}/alzheimer-assessment`);
  };
  
  // Navigate to patient history
  const viewPatientHistory = (patient) => {
    // Direct navigation to the Alzheimer history for this patient
    navigate(`/patients/${patient.id}/alzheimer-history`);
  };

  // Handle going back to dashboard
  const handleBackToDashboard = () => {
    setActiveTab('overview');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Alzheimer's Disease Assessment</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          {/* Tabs */}
          <div className="mb-4 flex border-b border-slate-300 dark:border-slate-700">
            <button 
              onClick={() => setSelectedTab('overview')}
              className={`py-2 px-4 ${selectedTab === 'overview' ? 
                (isDark ? 'text-purple-400 border-b-2 border-purple-400' : 'text-purple-600 border-b-2 border-purple-600') : 
                (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700')}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedTab('patients')}
              className={`py-2 px-4 ${selectedTab === 'patients' ? 
                (isDark ? 'text-purple-400 border-b-2 border-purple-400' : 'text-purple-600 border-b-2 border-purple-600') : 
                (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700')}`}
            >
              Patients
            </button>
          </div>
          
          {/* Overview Tab Content */}
          {selectedTab === 'overview' && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-500"/>
                About This Tool
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Our AI model analyzes MRI brain scans to detect signs of Alzheimer's disease, 
                classifying them into stages of cognitive impairment to aid in early diagnosis.
              </p>
              
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <h4 className="font-medium mb-2">Classification Categories:</h4>
                <ul className={`${isDark ? 'text-slate-300' : 'text-slate-600'} list-disc list-inside space-y-1`}>
                  <li><span className="font-medium">CN</span>: Cognitive Normal (Non Demented)</li>
                  <li><span className="font-medium">EMCI</span>: Early Mild Cognitive Impairment</li>
                  <li><span className="font-medium">LMCI</span>: Late Mild Cognitive Impairment</li>
                  <li><span className="font-medium">AD</span>: Alzheimer's Disease (Moderate Dementia)</li>
                </ul>
              </div>
              
              <div className={`p-3 border ${isDark ? 'border-amber-700 bg-amber-900/20' : 'border-amber-200 bg-amber-50'} rounded-md`}>
                <p className={`${isDark ? 'text-amber-300' : 'text-amber-800'} text-sm flex items-start`}>
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
                  This tool is for assistance only. All results should be reviewed by a qualified specialist.
                </p>
              </div>
            </div>
          )}
          
          {/* Patients Tab Content */}
          {selectedTab === 'patients' && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500"/>
                Recent Patients
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {patients.slice(0, 5).map(patient => (
                  <div 
                    key={patient.id}
                    className={`${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'} p-3 rounded-lg cursor-pointer transition-colors`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3 flex-shrink-0`}>
                        <User className={`h-4 w-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'} text-sm`}>
                          {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                        </h4>
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Age: {patient.age} | Gender: {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                        </div>
                      </div>
                      <button className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setActiveTab('patients')}
                className={`mt-4 block text-center py-2 px-4 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'} transition-colors text-sm w-full`}
              >
                View All Patients
              </button>
            </div>
          )}
        </div>

        {/* Main Section */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">Start Alzheimer's Assessment</h3>
          
          {patientError && (
            <div className={`p-3 mb-4 border ${isDark ? 'border-rose-700 bg-rose-900/20 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-800'} rounded-md`}>
              {patientError}
            </div>
          )}
          
          <div className="mb-4 relative">
            <div className={`flex items-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-md pl-3`}>
              <Search className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-slate-700 text-white placeholder-slate-400' 
                    : 'bg-slate-100 text-slate-800 placeholder-slate-500'
                } border-0 focus:outline-none focus:ring-0`}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
              <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <Users className={`inline-block h-10 w-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchTerm ? 'No patients match your search' : 'No patients found'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-[500px] overflow-y-auto p-1">
              {filteredPatients.map(patient => (
                <div 
                  key={patient.id}
                  className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg transition-colors`}
                >
                  <div className="flex items-start">
                    <div className={`${isDark ? 'bg-slate-600' : 'bg-white'} h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                      <User className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-grow">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className={`h-4 w-4 mr-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Age: {patient.age}
                          </span>
                        </div>
                        
                        <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Gender: {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                        </div>
                        
                        {patient.email && (
                          <div className={`col-span-2 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Email: {patient.email}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => handlePatientSelect(patient)}
                          className={`flex-1 py-2 px-3 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-500'} text-white text-sm rounded transition-colors flex items-center justify-center`}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          New Assessment
                        </button>
                        <button 
                          onClick={() => viewPatientHistory(patient)}
                          className={`flex-1 py-2 px-3 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600' : 'bg-white hover:bg-slate-100 border-slate-300'} border text-sm rounded transition-colors flex items-center justify-center`}
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/patients/new')}
                className={`py-3 px-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-lg transition-colors flex items-center`}
              >
                <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <User className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <span>Add New Patient</span>
              </button>
              
              <button
                onClick={handleBackToDashboard}
                className={`py-3 px-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-lg transition-colors flex items-center`}
              >
                <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <Home className={`h-4 w-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                </div>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlzheimerView;