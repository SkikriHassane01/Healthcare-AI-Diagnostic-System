import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Activity,
  LogOut, 
  Brain,
  Layers,
  Bug,
  Stethoscope,
  HeartPulse,
  X
} from 'lucide-react';

const Sidebar = ({ 
  isDark, 
  isSidebarOpen, 
  isMobile, 
  activeTab, 
  setActiveTab, 
  toggleSidebar, 
  onLogout 
}) => {
  // Function to handle sidebar navigation
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile when a navigation item is clicked
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      <aside 
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} 
                   fixed md:relative z-30 border-r h-full transition-transform duration-300 ease-in-out 
                   w-64 md:translate-x-0 shadow-lg overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-3 ${isDark ? 'hover:text-sky-400' : 'hover:text-sky-600'} transition-colors`}
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-md bg-sky-600 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg">HealthAI</span>
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
                activeTab === 'overview' 
                  ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                  : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
              } font-medium`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('patients')}
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
              
              {/* Reordered diagnostics: Diabetes first */}
              <button
                onClick={() => handleNavigation('diabetes')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'diabetes' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Activity className="h-5 w-5 mr-3" />
                <span>Diabetes</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">Tabular</span>
              </button>
              
              {/* Breast Cancer second */}
              <button
                onClick={() => handleNavigation('breast-cancer')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'breast-cancer' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <HeartPulse className="h-5 w-5 mr-3" />
                <span>Breast Cancer</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">Tabular</span>
              </button>
              
              {/* Brain Tumor third */}
              <button
                onClick={() => handleNavigation('brain-tumor')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'brain-tumor' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Brain className="h-5 w-5 mr-3" />
                <span>Brain Tumor</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">Image</span>
              </button>
              
              {/* Alzheimer's */}
              <button
                onClick={() => handleNavigation('alzheimer')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'alzheimer' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Brain className="h-5 w-5 mr-3" />
                <span>Alzheimer's</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded">Image</span>
              </button>
              
              {/* COVID-19 */}
              <button
                onClick={() => handleNavigation('covid')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'covid' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Bug className="h-5 w-5 mr-3" />
                <span>COVID-19</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded">Image</span>
              </button>
              
              {/* Pneumonia */}
              <button
                onClick={() => handleNavigation('pneumonia')}
                className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                  activeTab === 'pneumonia' 
                    ? (isDark ? 'bg-slate-700 text-white' : 'bg-sky-100 text-sky-800') 
                    : (isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800')
                } font-medium`}
              >
                <Stethoscope className="h-5 w-5 mr-3" />
                <span>Pneumonia</span>
                <span className="ml-auto text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">Image</span>
              </button>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={onLogout}
                className={`flex items-center w-full text-left p-3 rounded-lg cursor-pointer ${isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-sky-800'} font-medium transition-colors`}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
            
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;