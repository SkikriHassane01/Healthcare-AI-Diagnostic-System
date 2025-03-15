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
  Layers
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
            <a 
              href="#" 
              className={`flex items-center p-3 rounded-lg ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Patients</span>
            </a>
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
                onClick={() => navigate('/login')}
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
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {currentUser.first_name || 'User'}!</h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-md mx-auto`}>
              This dashboard is currently in development. Future updates will add functionality for 
              patient management and diagnostic tools.
            </p>
          </div>
        </main>

        {/* Footer */}        <footer className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-6 py-4 transition-colors duration-300`}>          <div className="flex flex-col sm:flex-row justify-between items-center">            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>              &copy; {new Date().getFullYear()} HealthAI Diagnostics. All rights reserved.            </p>            <div className="mt-2 sm:mt-0">              <Link                 to="/"                 className={`text-sm ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-800'}`}              >                Back to Homepage              </Link>            </div>          </div>        </footer>      </div>    </div>
  );
};

export default Dashboard;