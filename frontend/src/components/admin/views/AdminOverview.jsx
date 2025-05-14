import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Brain,
  Calendar,
  BarChart2,
  TrendingUp,
  FileText,
  Settings,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import UserRegistrationChart from './UserRegistrationChart';

const AdminOverview = ({ isDark, stats, loading: initialLoading }) => {
  const [loading, setLoading] = useState(initialLoading);
  const [chartData, setChartData] = useState({
    userRegistration: [],
    diagnosticsType: [],
    userGrowth: { percentage: 0, direction: 'up' },
    patientGrowth: { percentage: 0, direction: 'up' },
    diagnosticsGrowth: { percentage: 0, direction: 'up' },
    monthlyGrowth: { percentage: 0, direction: 'up' }
  });
  const [loadingCharts, setLoadingCharts] = useState({
    userRegistration: true,
    diagnosticsType: true
  });
  const [error, setError] = useState(null);

  // Fetch detailed analytics data when component mounts
  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        setLoadingCharts({
          userRegistration: true,
          diagnosticsType: true
        });

        // Fetch user registration data
        try {
          // In a real implementation, fetch from API:
          // const userStats = await adminService.getUserRegistrationTrend('year');
          
          // For now, simulate API call with timeout
          setTimeout(() => {
            // This would be real data from your API in production
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
            
            setChartData(prev => ({
              ...prev,
              userRegistration: userRegistrationData
            }));
            
            setLoadingCharts(prev => ({
              ...prev,
              userRegistration: false
            }));
          }, 800);
        } catch (err) {
          console.error("Error fetching user registration trend:", err);
          setLoadingCharts(prev => ({
            ...prev,
            userRegistration: false
          }));
        }

        // Fetch diagnostics by type data
        try {
          // In a real implementation, fetch from API:
          // const diagnosticsStats = await adminService.getDiagnosticsByType();
          
          // For now, use data from stats or fallback to mock data
          setTimeout(() => {
            // Extract data from the stats prop if available, otherwise use mock data
            const diagnosticsTypeData = [];
            
            // Try to use data from stats.diagnosticsByType if available
            if (stats && stats.diagnosticsByType) {
              // If backend provides diagnostics by type data in the expected format
              if (stats.diagnosticsByType.diabetes) {
                diagnosticsTypeData.push({ 
                  type: 'Diabetes', 
                  count: stats.diagnosticsByType.diabetes.total || 0 
                });
              }
              
              if (stats.diagnosticsByType.brainTumor) {
                diagnosticsTypeData.push({ 
                  type: 'Brain Tumor', 
                  count: stats.diagnosticsByType.brainTumor.total || 0 
                });
              }
              
              if (stats.diagnosticsByType.alzheimer) {
                diagnosticsTypeData.push({ 
                  type: 'Alzheimer', 
                  count: stats.diagnosticsByType.alzheimer.total || 0 
                });
              }
              
              if (stats.diagnosticsByType.breastCancer) {
                diagnosticsTypeData.push({ 
                  type: 'Breast Cancer', 
                  count: stats.diagnosticsByType.breastCancer.total || 0 
                });
              }
            }
            
            // If we couldn't find any data or the data was incomplete, add mock data
            if (diagnosticsTypeData.length === 0) {
              diagnosticsTypeData.push(
                { type: 'Diabetes', count: 480 },
                { type: 'Brain Tumor', count: 320 },
                { type: 'Alzheimer', count: 210 },
                { type: 'Breast Cancer', count: 180 },
                { type: 'COVID-19', count: 150 },
                { type: 'Pneumonia', count: 120 }
              );
            } else if (diagnosticsTypeData.length < 4) {
              // Add some additional mock data to fill out the chart if real data is incomplete
              if (!diagnosticsTypeData.find(item => item.type === 'COVID-19')) {
                diagnosticsTypeData.push({ type: 'COVID-19', count: 150 });
              }
              
              if (!diagnosticsTypeData.find(item => item.type === 'Pneumonia')) {
                diagnosticsTypeData.push({ type: 'Pneumonia', count: 120 });
              }
            }
            
            // Sort by count in descending order
            diagnosticsTypeData.sort((a, b) => b.count - a.count);
            
            setChartData(prev => ({
              ...prev,
              diagnosticsType: diagnosticsTypeData
            }));
            
            setLoadingCharts(prev => ({
              ...prev,
              diagnosticsType: false
            }));
          }, 1200);
        } catch (err) {
          console.error("Error fetching diagnostics by type:", err);
          setLoadingCharts(prev => ({
            ...prev,
            diagnosticsType: false
          }));
        }

        // Get growth percentages from backend or calculate them
        try {
          // In a real implementation:
          // const growthStats = await adminService.getGrowthStats();
          
          // For now, use mock growth data
          setTimeout(() => {
            setChartData(prev => ({
              ...prev,
              userGrowth: { percentage: 12.5, direction: 'up' },
              patientGrowth: { percentage: 8.3, direction: 'up' },
              diagnosticsGrowth: { percentage: 15.2, direction: 'up' },
              monthlyGrowth: { percentage: 5.7, direction: 'up' }
            }));
            
            setLoading(false);
          }, 500);
        } catch (err) {
          console.error("Error fetching growth statistics:", err);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching detailed analytics:", error);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
        setLoadingCharts({
          userRegistration: false,
          diagnosticsType: false
        });
      }
    };

    fetchDetailedStats();
  }, [stats]);

  // Function to refresh dashboard data
  const refreshData = () => {
    // In a real implementation, this would re-fetch data from API
    setLoading(true);
    setLoadingCharts({
      userRegistration: true,
      diagnosticsType: true
    });
    
    // Simulate API refresh with timeout
    setTimeout(() => {
      // Fetch data again using the existing useEffect logic
      setLoading(false);
      setLoadingCharts({
        userRegistration: false,
        diagnosticsType: false
      });
    }, 1500);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Administration Dashboard</h2>
        
        {/* Refresh button */}
        <button 
          onClick={refreshData}
          disabled={loading}
          className={`px-4 py-2 rounded-md flex items-center ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      {/* Error alert */}
      {error && (
        <div className={`mb-6 p-4 rounded-md ${isDark ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

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
                <p className="text-2xl font-bold">{stats.userCount?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${chartData.userGrowth.direction === 'up' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')} flex items-center`}>
              {chartData.userGrowth.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{chartData.userGrowth.percentage}% {chartData.userGrowth.direction === 'up' ? 'increase' : 'decrease'} this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Patients</h3>
                <p className="text-2xl font-bold">{stats.patientCount?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${chartData.patientGrowth.direction === 'up' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')} flex items-center`}>
              {chartData.patientGrowth.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{chartData.patientGrowth.percentage}% {chartData.patientGrowth.direction === 'up' ? 'increase' : 'decrease'} this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Diagnostics</h3>
                <p className="text-2xl font-bold">{stats.totalDiagnostics?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${chartData.diagnosticsGrowth.direction === 'up' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')} flex items-center`}>
              {chartData.diagnosticsGrowth.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{chartData.diagnosticsGrowth.percentage}% {chartData.diagnosticsGrowth.direction === 'up' ? 'increase' : 'decrease'} this month</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last 30 Days</h3>
                <p className="text-2xl font-bold">{stats.lastMonthDiagnostics?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className={`text-xs ${chartData.monthlyGrowth.direction === 'up' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')} flex items-center`}>
              {chartData.monthlyGrowth.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{chartData.monthlyGrowth.percentage}% {chartData.monthlyGrowth.direction === 'up' ? 'increase' : 'decrease'} vs. previous</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Registration Chart - FIXED VERSION */}
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
          <UserRegistrationChart 
            userRegistrationData={chartData.userRegistration} 
            isDark={isDark} 
            isLoading={loadingCharts.userRegistration}
          />
          
          <div className="mt-4 text-center">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Users: <span className="font-semibold">{stats.userCount?.toLocaleString() || 0}</span>
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
          {loadingCharts.diagnosticsType ? (
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="space-y-2">
                  <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          ) : chartData.diagnosticsType.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No diagnostics data available
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chartData.diagnosticsType.map((item, index) => {
                const maxCount = Math.max(...chartData.diagnosticsType.map(item => item.count));
                const width = maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%';
                const colors = [
                  'bg-emerald-500', 'bg-purple-500', 'bg-blue-500', 
                  'bg-pink-500', 'bg-red-500', 'bg-amber-500'
                ];
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.type}</span>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.count.toLocaleString()}</span>
                    </div>
                    <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width }}
                        role="graphics-symbol"
                        aria-label={`${item.type}: ${item.count.toLocaleString()} diagnostics`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Diagnostics: <span className="font-semibold">{chartData.diagnosticsType.reduce((a, b) => a + b.count, 0).toLocaleString()}</span>
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