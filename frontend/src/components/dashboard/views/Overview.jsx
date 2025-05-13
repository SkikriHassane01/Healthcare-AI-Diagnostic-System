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
  Info,
  Heart
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

      {/* Healthcare AI Dashboard description */}
      <div className={`mb-8 p-6 rounded-lg border shadow-sm ${
        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-blue-50 border-blue-100 text-slate-700'
      }`}>
        <div className="flex items-start">
          <Info className={`h-6 w-6 mr-3 mt-1 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h3 className="font-semibold text-xl mb-2">Healthcare AI Dashboard</h3>
            <p className="mb-3">This dashboard provides access to multiple AI diagnostic tools to assist your healthcare decision-making.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                <Users className={`h-8 w-8 mr-3 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <div>
                  <p className="text-2xl font-bold">{patientCount}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Patients</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                <Activity className={`h-8 w-8 mr-3 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI Diagnostic Tools</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-700' : 'bg-white'}`}>
                <ClipboardList className={`h-8 w-8 mr-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Diagnostic Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Tools Section */}
      <h3 className="text-xl font-semibold mb-4">Diagnostic Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Diabetes Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Activity className="h-5 w-5 text-emerald-600 mr-2" />
            Diabetes Analytics
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">Tabular</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\diabetes.jpg" 
              alt="Diabetes analytics visualization" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Analyze patient health data to predict diabetes risk with high accuracy.
          </p>
          <button
            onClick={() => setActiveTab('diabetes')}
            className={`w-full py-2 ${isDark ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>

        {/* Breast Cancer Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Heart className="h-5 w-5 text-pink-600 mr-2" />
            Breast Cancer Detection
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded">Tabular</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\breastcan.jpg" 
              alt="Breast cancer visualization" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Analyze patient data to identify potential breast cancer markers.
          </p>
          <button
            onClick={() => setActiveTab('breast-cancer')}
            className={`w-full py-2 ${isDark ? 'bg-pink-700 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>

        {/* Brain Tumor Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            Brain Tumor Detection
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">Image</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\brain_tumor.jpg" 
              alt="Brain MRI visualization" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Analyze brain MRI scans to detect and localize potential tumors.
          </p>
          <button
            onClick={() => setActiveTab('brain-tumor')}
            className={`w-full py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>

        {/* Alzheimer's Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Brain className="h-5 w-5 text-indigo-600 mr-2" />
            Alzheimer's Detection
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">Image</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\alzheimer.jpg" 
              alt="Alzheimer's brain scan" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Evaluate brain scans to detect early signs of Alzheimer's disease.
          </p>
          <button
            onClick={() => setActiveTab('alzheimer')}
            className={`w-full py-2 ${isDark ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>

        {/* COVID-19 Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Bug className="h-5 w-5 text-red-600 mr-2" />
            COVID-19 Detection
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded">Image</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\covid19.jpg" 
              alt="COVID-19 lung scan" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Analyze chest X-rays to identify COVID-19 related lung patterns.
          </p>
          <button
            onClick={() => setActiveTab('covid')}
            className={`w-full py-2 ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>

        {/* Pneumonia Card */}
        <div className={`rounded-lg shadow-sm border p-4 transition-transform hover:-translate-y-1 duration-200
          ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
        `}>
          <h3 className="font-semibold flex items-center mb-3">
            <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
            Pneumonia Detection
            <span className="ml-auto text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">Image</span>
          </h3>
          <div className="mb-3 overflow-hidden rounded-lg h-64">
            <img 
              src="src\assets\images\pneumonia.jpg" 
              alt="Pneumonia chest X-ray" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Detect pneumonia from chest X-rays with advanced AI pattern recognition.
          </p>
          <button
            onClick={() => setActiveTab('pneumonia')}
            className={`w-full py-2 ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded transition-colors text-sm`}
          >
            Access Tool
          </button>
        </div>
      </div>
      
      {/* Recent Patients Section */}
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
                isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
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
                    {patient.age} years&nbsp;old&nbsp;&bull;&nbsp;
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