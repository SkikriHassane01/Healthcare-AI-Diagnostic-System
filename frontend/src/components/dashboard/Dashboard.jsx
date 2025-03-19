import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../layout/ThemeToggle';
import authService from '../../services/auth.service';
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
  UserPlus
} from 'lucide-react';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState({ first_name: 'Guest', last_name: 'User' });
  const navigate = useNavigate();

  // Get current user on component mount with error handling
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
            <span className="font-bold text-lg">HealthAI Diagnostics</span>
          </Link>
          
          {/* Sidebar Navigation */}
          <nav className="mt-6 space-y-1">
            <a 
              href="#" 
              className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800'} font-medium`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </a>
            <Link 
              to="/patients" 
              className={`flex items-center p-3 rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Patients</span>
            </Link>
            <div className="pt-2 pb-2">
              <div className={`pl-3 mb-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>DIAGNOSTICS</div>
              <a 
                href="#" 
                className={`flex items-center p-3 rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <Activity className="h-5 w-5 mr-3" />
                <span>Diabetes Analysis</span>
              </a>
              <a 
                href="#" 
                className={`flex items-center p-3 rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>Brain Tumor Detection</span>
              </a>
            </div>
            <div className="pt-2">
              <a 
                href="#" 
                className={`flex items-center p-3 rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </a>
              <a 
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </a>
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
        {/* Header - Removed notification icon */}
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
              <h1 className="text-lg font-semibold">Dashboard</h1>
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
          <div className="mb-8">
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
                <p className="text-3xl font-bold">-</p>
                <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Link to="/patients" className={`${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
                    View all patients
                  </Link>
                </div>
              </div>
              
              {/* Diabetes Assessments Card */}
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Diabetes Assessments</h3>
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">-</p>
                <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Integrated assessment tool available</span>
                </div>
              </div>
              
              {/* Brain Tumor Scans Card */}
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Brain Tumor Scans</h3>
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">-</p>
                <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Coming soon</span>
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
                </div>
              </div>
              
              {/* Recent Diagnoses Card */}
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 md:col-span-2`}>
                <h3 className="font-semibold mb-4">Recent Diagnostic Activities</h3>
                <div className={`p-4 text-center ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'} rounded-lg`}>
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>No recent diagnostic activities</p>
                  <p className="text-sm mt-1">
                    Select a patient and run a diabetes assessment to see results here
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </main>

        {/* Footer */}        <footer className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-6 py-4 transition-colors duration-300`}>          <div className="flex flex-col sm:flex-row justify-between items-center">            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>              &copy; {new Date().getFullYear()} HealthAI Diagnostics. All rights reserved.            </p>            <div className="mt-2 sm:mt-0">              <Link                 to="/"                 className={`text-sm ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-800'}`}              >                Back to Homepage              </Link>            </div>          </div>        </footer>      </div>    </div>
  );
};

export default Dashboard;