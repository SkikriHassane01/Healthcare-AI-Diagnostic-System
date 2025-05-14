import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, UserPlus, FileText, Activity } from 'lucide-react';

const PatientOverview = ({ isDark, setActiveTab }) => {
  return (
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            <Link 
              to="/patients/new" 
              className="block w-full flex items-center justify-center p-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow transition-colors"
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
            
            <Link 
              to="/patients/search" 
              className={`block w-full flex items-center justify-center p-4 rounded-lg shadow transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-200'
              } border`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Search Patients
            </Link>
          </div>
          
        </div>
        
        <div className={`md:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">Patient Health Assessments</h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium">Diabetes Risk Assessment</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Calculate patient's risk of developing diabetes based on health data
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => setActiveTab('diabetes')}
                    className={`px-3 py-1 rounded-md ${
                      isDark ? 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    } transition-colors text-sm`}
                  >
                    View Tool
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 10H14C13.4477 10 13 10.4477 13 11V16M8 7V17M8 7L6 9M8 7L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Brain Tumor Detection</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Analyze MRI scans to detect potential brain tumors
                  </p>
                </div>
                <div className="ml-auto">
                  <Link
                    to="/diagnostics/brain-tumor"
                    className={`px-3 py-1 rounded-md ${
                      isDark ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    } transition-colors text-sm inline-block`}
                  >
                    View Tool
                  </Link>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 10H14C13.4477 10 13 10.4477 13 11V16M8 7V17M8 7L6 9M8 7L10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Alzheimer's Assessment</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Analyze MRI scans to detect signs of Alzheimer's disease
                  </p>
                </div>
                <div className="ml-auto">
                  <Link
                    to="/diagnostics/alzheimer"
                    className={`px-3 py-1 rounded-md ${
                      isDark ? 'bg-pink-900 text-pink-200 hover:bg-pink-800' : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                    } transition-colors text-sm inline-block`}
                  >
                    View Tool
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientOverview;
