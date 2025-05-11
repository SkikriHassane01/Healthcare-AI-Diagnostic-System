import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Brain, 
  UserPlus, 
  ClipboardList, 
  Stethoscope,
  Bug,
  Info
} from 'lucide-react';

const Overview = ({
  isDark,
  currentUser,
  patientCount,
  recentPatients,
  loading,
  setActiveTab
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {currentUser.first_name || 'User'}!
      </h2>

      {/* Overview description section */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-blue-50 border-blue-100 text-slate-700'
      }`}>
        <div className="flex items-start">
          <Info className={`h-5 w-5 mr-2 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h3 className="font-medium text-lg mb-1">Healthcare AI Dashboard</h3>
            <p className="mb-2">This dashboard provides access to multiple AI diagnostic tools to assist your healthcare decision-making.</p>
            <ul className={`list-disc list-inside ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
              <li>Use the diagnostic models for diabetes, brain tumor, Alzheimer's, and more</li>
              <li>Manage your patient records and their diagnostic history</li>
              <li>Access quick actions from this dashboard or navigate using the sidebar</li>
              <li>View recent patients and their basic information</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Patients Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Patients</h3>
            <div className="w-8 h-8 rounded-full bg-sky-600/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-sky-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{patientCount}</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {/* You can link to patients list */}
          </div>
        </div>

        {/* Diabetes Analytics */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
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

        {/* Brain Tumor */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Brain Tumor Detection</h3>
            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Ready</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button
              onClick={() => setActiveTab('brain-tumor')}
              className={`${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
            >
              Brain Tumor Tool
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Alzheimer’s */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Alzheimer’s Detection</h3>
            <div className="w-8 h-8 rounded-full bg-pink-600/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-pink-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Ready</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button
              onClick={() => setActiveTab('alzheimer')}
              className={`${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}
            >
              Alzheimer’s Tool
            </button>
          </div>
        </div>

        {/* COVID-19 */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">COVID-19 Detection</h3>
            <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
              <Bug className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Ready</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button
              onClick={() => setActiveTab('covid')}
              className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
            >
              COVID-19 Tool
            </button>
          </div>
        </div>

        {/* Pneumonia */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Pneumonia Detection</h3>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">Ready</p>
          <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button
              onClick={() => setActiveTab('pneumonia')}
              className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Pneumonia Tool
            </button>
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
            
            <button 
              onClick={() => setActiveTab('patients')}
              className={`flex items-center w-full text-left p-3 rounded-md ${
                isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
              } transition-colors`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>View All Patients</span>
            </button>
            
            <button
              onClick={() => setActiveTab('diabetes')}
              className={`flex items-center w-full text-left p-3 rounded-md ${
                isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
              } transition-colors`}
            >
              <Activity className="h-5 w-5 mr-3" />
              <span>Diabetes Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('brain-tumor')}
              className={`flex items-center w-full text-left p-3 rounded-md ${
                isDark ? 'bg-purple-700 hover:bg-purple-600 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
              } transition-colors`}
            >
              <Brain className="h-5 w-5 mr-3" />
              <span>Brain Tumor Tool</span>
            </button>
            
            <button
              onClick={() => setActiveTab('alzheimer')}
              className={`flex items-center w-full text-left p-3 rounded-md ${
                isDark ? 'bg-pink-700 hover:bg-pink-600 text-white' : 'bg-pink-100 hover:bg-pink-200 text-pink-800'
              } transition-colors`}
            >
              <Brain className="h-5 w-5 mr-3" />
              <span>Alzheimer's Tool</span>
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
                    <p className="font-medium">{patient.full_name || `${patient.first_name} ${patient.last_name}`}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {patient.age} years&nbsp;old&nbsp;&bull;&nbsp;
                      {/* fallback to `created_at` or `updated_at` if you track different fields */}
                      {new Date(patient.created_at || patient.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No recent patients found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Overview;
