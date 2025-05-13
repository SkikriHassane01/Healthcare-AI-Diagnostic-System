import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BarChart2,
  Activity,
  Settings,
  FileText,
  LogOut,
  Database
} from 'lucide-react';

const AdminSidebar = ({ 
  isDark, 
  isSidebarOpen, 
  isMobile, 
  activeView, 
  setActiveView, 
  toggleSidebar, 
  onLogout 
}) => {
  // Function to handle sidebar navigation
  const handleNavigation = (view) => {
    setActiveView(view);
    // Close sidebar on mobile when a navigation item is clicked
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <aside 
      className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} 
                 fixed md:relative z-30 border-r h-full transition-transform duration-300 ease-in-out 
                 w-64 md:translate-x-0 shadow-lg overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/admin" 
            className={`flex items-center space-x-3 ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-colors`}
          >
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
          
          {/* Close button for mobile view */}
          {isMobile && (
            <button 
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${
                isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="mt-6 space-y-1">
          <button 
            onClick={() => handleNavigation('overview')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'overview' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('users')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'users' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <Users className="h-5 w-5 mr-3" />
            <span>User Management</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('patients')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'patients' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <BarChart2 className="h-5 w-5 mr-3" />
            <span>Patient Analytics</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('diagnostics')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'diagnostics' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <Activity className="h-5 w-5 mr-3" />
            <span>Diagnostics Analytics</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('reports')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'reports' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <FileText className="h-5 w-5 mr-3" />
            <span>Report Generator</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('settings')}
            className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
              activeView === 'settings' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-purple-100 text-purple-800') 
                : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800')
            } font-medium`}
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>System Settings</span>
          </button>
          
          <div className="pt-6">
            <button 
              onClick={onLogout}
              className={`flex items-center w-full text-left p-3 rounded-lg cursor-pointer ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-purple-800'} font-medium transition-colors`}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;