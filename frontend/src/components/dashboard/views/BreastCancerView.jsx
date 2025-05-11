import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import patientService from '../../../services/patient.service';
import { 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  FileBarChart2, 
  ArrowRight, 
  Search,
  User,
  Calendar,
  Users,
  Heart,
  FileText,
  FileDown,
  Printer
} from 'lucide-react';

const BreastCancerView = ({ isDark }) => {
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
    // Direct navigation to the breast cancer assessment form for this patient
    window.location.href = `/patients/${patient.id}/breast-cancer-assessment`;
  };
  
  // Navigate to patient history
  const viewPatientHistory = (patient) => {
    // Direct navigation to the breast cancer history for this patient
    window.location.href = `/patients/${patient.id}/breast-cancer-history`;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Breast Cancer Detection</h2>
        <Link 
          to="/dashboard" 
          className={`px-3 py-1 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors text-sm flex items-center`}
        >
          <Home className="w-4 h-4 mr-1" />Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          {/* Tabs */}
          <div className="mb-4 flex border-b border-slate-300 dark:border-slate-700">
            <button 
              onClick={() => setSelectedTab('overview')}
              className={`py-2 px-4 ${selectedTab === 'overview' ? 
                (isDark ? 'text-pink-400 border-b-2 border-pink-400' : 'text-pink-600 border-b-2 border-pink-600') : 
                (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700')}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedTab('patients')}
              className={`py-2 px-4 ${selectedTab === 'patients' ? 
                (isDark ? 'text-pink-400 border-b-2 border-pink-400' : 'text-pink-600 border-b-2 border-pink-600') : 
                (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700')}`}
            >
              Patients
            </button>
          </div>
          
          {/* Overview Tab Content */}
          {selectedTab === 'overview' && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <FileBarChart2 className="mr-2 h-5 w-5 text-pink-500"/>
                About This Tool
              </h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                This AI model analyzes Fine Needle Aspiration (FNA) test data to determine if a breast mass is benign or malignant with high accuracy.
              </p>
              
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <h4 className="font-medium mb-2">About the biomarkers:</h4>
                <ul className={`${isDark ? 'text-slate-300' : 'text-slate-600'} list-disc list-inside space-y-1`}>
                  <li><span className="font-medium">Radius</span>: Mean distance from center to points on the perimeter</li>
                  <li><span className="font-medium">Texture</span>: Standard deviation of gray-scale values</li>
                  <li><span className="font-medium">Perimeter</span>: Perimeter of the cell nucleus</li>
                  <li><span className="font-medium">Area</span>: Area of the cell nucleus</li>
                  <li><span className="font-medium">Smoothness</span>: Local variation in radius lengths</li>
                  <li><span className="font-medium">Compactness</span>: Perimeter² / area - 1.0</li>
                </ul>
              </div>
              
              <div className={`p-3 border ${isDark ? 'border-amber-700 bg-amber-900/20' : 'border-amber-200 bg-amber-50'} rounded-md`}>
                <p className={`${isDark ? 'text-amber-300' : 'text-amber-800'} text-sm flex items-start`}>
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
                  This tool is for assistance only. Always confirm results with laboratory testing and clinical assessment.
                </p>
              </div>
            </div>
          )}
          
          {/* Patients Tab Content */}
          {selectedTab === 'patients' && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-pink-500"/>
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
                      <button className={`${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to="/patients"
                className={`mt-4 block text-center py-2 px-4 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'} transition-colors text-sm`}
              >
                View All Patients
              </Link>
            </div>
          )}
          
          {/* Statistics Tab Content */}
          {selectedTab === 'stats' && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <FileBarChart2 className="mr-2 h-5 w-5 text-pink-500"/>
                Model Statistics
              </h3>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} mb-4`}>
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Accuracy</span>
                      <span className="font-medium text-sm">96%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                      <div className="h-2 bg-pink-500 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sensitivity</span>
                      <span className="font-medium text-sm">94%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                      <div className="h-2 bg-pink-500 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Specificity</span>
                      <span className="font-medium text-sm">97%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                      <div className="h-2 bg-pink-500 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <h4 className="font-medium mb-2">Usage Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Assessments</span>
                    <span className="font-medium">284</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Malignant Detected</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Benign Detected</span>
                    <span className="font-medium">195</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Section */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">Start Breast Cancer Assessment</h3>
          
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
              <div className="inline-block w-8 h-8 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
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
                          className={`flex-1 py-2 px-3 ${isDark ? 'bg-pink-700 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-500'} text-white text-sm rounded transition-colors flex items-center justify-center`}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          New Assessment
                        </button>
                        <button 
                          onClick={() => viewPatientHistory(patient)}
                          className={`flex-1 py-2 px-3 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600' : 'bg-white hover:bg-slate-100 border-slate-300'} border text-sm rounded transition-colors flex items-center justify-center`}
                        >
                          <Heart className="h-4 w-4 mr-1" />
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
              <Link
                to="/patients/new"
                className={`py-3 px-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-lg transition-colors flex items-center`}
              >
                <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <User className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <span>Add New Patient</span>
              </Link>
              
              <Link
                to="/dashboard"
                className={`py-3 px-4 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-lg transition-colors flex items-center`}
              >
                <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <Home className={`h-4 w-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                </div>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
          
          {/* Information about saving records and exporting */}
          <div className="mt-6 p-4 border rounded-lg border-dashed border-pink-500/50">
            <h3 className="font-semibold mb-2 text-pink-500">About Saving and Exporting</h3>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} mb-3`}>
              When you perform a breast cancer assessment, you'll be able to:
            </p>
            <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-start">
                <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'} flex-shrink-0`} />
                <span>Save assessment results directly to the patient's electronic health record</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'} flex-shrink-0`} />
                <span>Export detailed results in PDF format for printing or sharing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'} flex-shrink-0`} />
                <span>View historical assessments to track changes over time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreastCancerView;