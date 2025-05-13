import React from 'react';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Brain, 
  Calendar,
  BarChart2,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

const AdminOverview = ({ isDark, stats, loading }) => {
  // Sample data for charts
  const userRegistrationData = [
    { date: 'Jan', count: 34 },
    { date: 'Feb', count: 42 },
    { date: 'Mar', count: 51 },
    { date: 'Apr', count: 48 },
    { date: 'May', count: 62 },
    { date: 'Jun', count: 58 },
    { date: 'Jul', count: 74 },
    { date: 'Aug', count: 80 },
    { date: 'Sep', count: 92 },
    { date: 'Oct', count: 86 },
    { date: 'Nov', count: 97 },
    { date: 'Dec', count: 104 },
  ];

  const diagnosticsTypeData = [
    { type: 'Diabetes', count: 480 },
    { type: 'Brain Tumor', count: 320 },
    { type: 'Alzheimer', count: 210 },
    { type: 'Breast Cancer', count: 180 },
    { type: 'COVID-19', count: 150 },
    { type: 'Pneumonia', count: 120 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Administration Dashboard</h2>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800 animate-pulse' : 'bg-white animate-pulse'}`}
            >
              <div className="h-12 w-12 rounded-full bg-slate-700 mb-4"></div>
              <div className="h-6 w-24 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 w-16 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Users</h3>
                <p className="text-2xl font-bold">{stats.userCount || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>12% increase this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Patients</h3>
                <p className="text-2xl font-bold">{stats.patientCount || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>8% increase this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Diagnostics</h3>
                <p className="text-2xl font-bold">{stats.totalDiagnostics || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>15% increase this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last 30 Days</h3>
                <p className="text-2xl font-bold">{stats.lastMonthDiagnostics || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>5% increase vs. previous</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Registration Chart */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">User Registration Trend</h3>
            <div className="flex space-x-2">
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Week</button>
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'}`}>Month</button>
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Year</button>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="h-64">
            <div className="h-full relative">
              {/* X Axis */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {userRegistrationData.map((item, index) => (
                  <div key={index} className="text-xs text-center w-8">
                    <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.date}</span>
                  </div>
                ))}
              </div>
              
              {/* Bars */}
              <div className="absolute bottom-5 top-0 left-0 right-0 flex justify-between items-end">
                {userRegistrationData.map((item, index) => {
                  const height = `${(item.count / 120) * 100}%`;
                  return (
                    <div key={index} className="w-6 flex justify-center">
                      <div 
                        className="w-4 rounded-t-sm bg-purple-500 bg-opacity-80 hover:bg-opacity-100 transition-all"
                        style={{ height }}
                        title={`${item.date}: ${item.count} users`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Users: <span className="font-semibold">{stats.userCount || 0}</span>
            </span>
          </div>
        </div>
        
        {/* Diagnostics by Type */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Diagnostics by Type</h3>
            <div className="flex space-x-2">
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>Count</button>
              <button className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'}`}>Percentage</button>
            </div>
          </div>
          
          {/* Chart - Horizontal Bar Chart */}
          <div className="space-y-4">
            {diagnosticsTypeData.map((item, index) => {
              const width = `${(item.count / diagnosticsTypeData[0].count) * 100}%`;
              const colors = [
                'bg-emerald-500', 'bg-purple-500', 'bg-blue-500', 
                'bg-pink-500', 'bg-red-500', 'bg-amber-500'
              ];
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.type}</span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.count}</span>
                  </div>
                  <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-2 rounded-full ${colors[index]}`}
                      style={{ width }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Predictions: <span className="font-semibold">{diagnosticsTypeData.reduce((a, b) => a + b.count, 0)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => window.location.href = '/admin/users'} className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'} transition-colors shadow-md`}>
          <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h4 className="font-medium">Manage Users</h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>View, add, edit user accounts</p>
          </div>
        </button>
        
        <button onClick={() => window.location.href = '/admin/reports'} className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'} transition-colors shadow-md`}>
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <FileText className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h4 className="font-medium">Generate Reports</h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Export system data reports</p>
          </div>
        </button>
        
        <button onClick={() => window.location.href = '/admin/settings'} className={`p-4 rounded-lg flex items-center ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'} transition-colors shadow-md`}>
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <Settings className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h4 className="font-medium">System Settings</h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure system parameters</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminOverview;