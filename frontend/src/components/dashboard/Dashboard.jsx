import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../layout/ThemeToggle';
import authService from '../../services/auth.service';
import diagnosticsService from '../../services/diagnostics.service';
import patientService from '../../services/patient.service';
import { 
  Home, 
  Users, 
  Activity, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Layers,
  UserPlus,
  ClipboardList,
  Brain
} from 'lucide-react';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState({ first_name: 'Guest', last_name: 'User' });
  const [activeTab, setActiveTab] = useState('overview');
  const [patientCount, setPatientCount] = useState(0);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get current user on component mount
  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Could not retrieve user information:", error);
    }
  }, []);

  // Load patients data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get patient count
        const patientsResponse = await patientService.getPatients({
          page: 1,
          per_page: 5
        });
        
        if (patientsResponse && patientsResponse.pagination) {
          setPatientCount(patientsResponse.pagination.total || 0);
          setRecentPatients(patientsResponse.patients || []);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get user's initials for avatar
  const getInitials = () => {
    if (currentUser.first_name && currentUser.last_name) {
      return `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}`;
    }
    return 'GU'; // Default if no name is available
  };

  // Get full name for display
  const getFullName = () => {
    if (currentUser.first_name && currentUser.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    return 'Guest User'; // Default if no name is available
  };

  // Check for mobile screen size and adjust sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderDashboardContent = () => {
    switch(activeTab) {
      case 'diabetes':
        return renderDiabetesAnalytics();
      case 'patients':
        return renderPatientOverview();
      default:
        return renderOverview();
    }
  };

  // Render main dashboard overview
  const renderOverview = () => (
    <>
      <h2 className="text-2xl font-bold mb-6">Welcome, {currentUser.first_name || 'User'}!</h2>
      
      {/* Dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Patients Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Patients</h3>
            <div className="w-8 h-8 rounded-full bg-sky-600/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-sky-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{patientCount}</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Link to="/patients" className={`${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
              View all patients
            </Link>
          </div>
        </div>
        
        {/* Diabetes Assessments Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Diabetes Analytics</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Ready</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button 
              onClick={() => setActiveTab('diabetes')}
              className={`${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}
            >
              View diabetes analytics
            </button>
          </div>
        </div>
        
        {/* Brain Tumor Scans Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Brain Tumor Detection</h3>
            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Coming soon</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Feature in development</span>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 md:col-span-1`}>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              to="/patients/new" 
              className="flex items-center p-3 rounded-md bg-sky-600 hover:bg-sky-500 text-white transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-3" />
              <span>Add New Patient</span>
            </Link>
            <Link 
              to="/patients" 
              className={`flex items-center p-3 rounded-md ${
                isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
              } transition-colors`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>View All Patients</span>
            </Link>
            <button
              onClick={() => setActiveTab('diabetes')}
              className={`flex items-center w-full text-left p-3 rounded-md ${
                isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
              } transition-colors`}
            >
              <Activity className="h-5 w-5 mr-3" />
              <span>Diabetes Analytics</span>
            </button>
          </div>
        </div>
        
        {/* Recent Patients */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 md:col-span-2`}>
          <h3 className="font-semibold mb-4">Recent Patients</h3>
          
          {loading ? (
            <div className="py-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-t-transparent border-slate-300 rounded-full animate-spin"></div>
              <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading patients...</p>
            </div>
          ) : recentPatients.length > 0 ? (
            <div className="space-y-2">
              {recentPatients.map(patient => (
                <Link 
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className={`flex items-center p-2 rounded-md ${
                    isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                  } transition-colors`}
                >
                  <div className={`h-9 w-9 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-medium">
                      {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{patient.full_name}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {patient.age} years, {patient.gender === 'male' ? 'Male' : 
                                           patient.gender === 'female' ? 'Female' : 'Other'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`p-4 text-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'} rounded-lg`}>
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No patients found</p>
              <p className="text-sm mt-1">
                Add your first patient to get started
              </p>
            </div>
          )}
          
          {patientCount > recentPatients.length && (
            <div className="mt-3 text-center">
              <Link 
                to="/patients"
                className={`inline-block text-sm ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}
              >
                View all {patientCount} patients →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Render Diabetes analytics section
  const renderDiabetesAnalytics = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Diabetes Analytics</h2>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 rounded-md ${
            isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
          } transition-colors text-sm flex items-center`}
        >
          <Home className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className={`col-span-1 lg:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-emerald-500" />
            Diabetes Prediction Tool
          </h3>
          
          <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Our AI-powered diabetes prediction tool uses patient data to calculate the risk of diabetes.
            The model analyzes factors like glucose levels, BMI, age, and other health indicators to provide
            a comprehensive risk assessment.
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <h4 className="font-medium mb-2">How to use the tool:</h4>
            <ol className={`list-decimal list-inside space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>Select a patient from your patient list</li>
              <li>Navigate to the patient's profile</li>
              <li>Click on "New Assessment" under Diabetes Assessment</li>
              <li>Fill in the required health data</li>
              <li>Review the AI prediction results</li>
              <li>Provide your professional assessment</li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/patients" 
              className="flex-1 flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Select Patient
            </Link>
          </div>
        </div>
        
        {/* Statistics Card */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">Key Diabetes Indicators</h3>
          
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Blood Glucose</p>
              <div className="flex justify-between items-center">
                <span className="font-medium">Normal range:</span>
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>70-99 mg/dL (fasting)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Prediabetes:</span>
                <span className={`${isDark ? 'text-amber-400' : 'text-amber-600'}`}>100-125 mg/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Diabetes:</span>
                <span className={`${isDark ? 'text-rose-400' : 'text-rose-600'}`}>≥126 mg/dL</span>
              </div>
            </div>
            
            <div className={`my-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
            
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HbA1c Level</p>
              <div className="flex justify-between items-center">
                <span className="font-medium">Normal range:</span>
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Below 5.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Prediabetes:</span>
                <span className={`${isDark ? 'text-amber-400' : 'text-amber-600'}`}>5.7% to 6.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Diabetes:</span>
                <span className={`${isDark ? 'text-rose-400' : 'text-rose-600'}`}>6.5% or higher</span>
              </div>
            </div>
            
            <div className={`my-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></div>
            
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Risk Factors</p>
              <ul className={`mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'} space-y-1`}>
                <li>• Age (over 45)</li>
                <li>• Overweight/Obesity (BMI ≥25)</li>
                <li>• Hypertension</li>
                <li>• Family history of diabetes</li>
                <li>• History of gestational diabetes</li>
                <li>• Sedentary lifestyle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render Patient overview section
  const renderPatientOverview = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Patient Management</h2>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 rounded-md ${
            isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
          } transition-colors text-sm flex items-center`}
        >
          <Home className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Link 
            to="/patients/new" 
            className="block w-full flex items-center justify-center p-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow transition-colors mb-4"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Patient
          </Link>
          
          <Link 
            to="/patients" 
            className={`block w-full flex items-center justify-center p-4 rounded-lg shadow transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-200'
            } border`}
          >
            <Users className="h-5 w-5 mr-2" />
            View All Patients
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} 
                   fixed md:relative z-30 border-r h-full transition-transform duration-300 ease-in-out 
                   w-64 md:translate-x-0 shadow-lg overflow-y-auto`}
      >
        <div className="p-4">
          <Link 
            to="/" 
            className={`flex items-center justify-center md:justify-start space-x-3 mb-8 ${isDark ? 'hover:text-sky-400' : 'hover:text-sky-600'} transition-colors`}
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-sky-600 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-lg">HealthAI</span>
          </Link>
          
          {/* Sidebar Navigation */}
          <nav className="mt-6 space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                  : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
              } font-medium`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('patients')}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                activeTab === 'patients' 
                  ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                  : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
              } font-medium`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Patients</span>
            </button>
            
            <div className="pt-2 pb-2">
              <div className={`pl-3 mb-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>DIAGNOSTICS</div>
              
              <button
                onClick={() => setActiveTab('diabetes')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'diabetes' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Activity className="h-5 w-5 mr-3" />
                <span>Diabetes Analytics</span>
              </button>
              
              <button
                disabled
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                } font-medium cursor-not-allowed`}
              >
                <Brain className="h-5 w-5 mr-3" />
                <span>Brain Tumor (Soon)</span>
              </button>
            </div>
            
            <div className="pt-2">
              <button
                disabled
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                } font-medium cursor-not-allowed`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </button>
              
              <button 
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className={`flex items-center w-full text-left p-3 rounded-lg cursor-pointer ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm sticky top-0 z-10 transition-colors duration-300`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar} 
                className={`${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-sky-600'} p-2 rounded-md transition-colors mr-2`}
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-lg font-semibold">
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'patients' ? 'Patient Management' : 
                 activeTab === 'diabetes' ? 'Diabetes Analytics' : 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center mr-2">
                  <span className="font-medium text-sm">{getInitials()}</span>
                </div>
                <span className="hidden md:block text-sm font-medium">{getFullName()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderDashboardContent()}
        </main>

        {/* Footer */}
        <footer className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-6 py-4 transition-colors duration-300`}>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              &copy; {new Date().getFullYear()} HealthAI. All rights reserved.
            </p>
            <div className="mt-2 sm:mt-0">
              <Link
                to="/"
                className={`text-sm ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-800'}`}
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;