import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Calendar,
  BarChart2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import UserRegistrationChart from './UserRegistrationChart';
import adminService from '../../../services/admin.service';

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
  const [timeRange, setTimeRange] = useState('month'); // Default to month view
  const [displayMode, setDisplayMode] = useState('percentage'); // Default to percentage view

  // Fetch detailed analytics data when component mounts or timeRange changes
  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        setLoadingCharts({
          userRegistration: true,
          diagnosticsType: true
        });
        setError(null);

        // Fetch user registration data based on timeRange
        try {
          const userStats = await adminService.getUserRegistrationTrend(timeRange);
          
          if (userStats && userStats.data) {
            setChartData(prev => ({
              ...prev,
              userRegistration: userStats.data
            }));
          }
          
          setLoadingCharts(prev => ({
            ...prev,
            userRegistration: false
          }));
        } catch (err) {
          console.error("Error fetching user registration trend:", err);
          setLoadingCharts(prev => ({
            ...prev,
            userRegistration: false
          }));
          setError("Failed to load user registration data");
        }

        // Fetch diagnostics by type data
        try {
          const diagnosticsStats = await adminService.getDiagnosticsByType();
          
          if (diagnosticsStats && diagnosticsStats.data) {
            setChartData(prev => ({
              ...prev,
              diagnosticsType: diagnosticsStats.data
            }));
          }
          
          setLoadingCharts(prev => ({
            ...prev,
            diagnosticsType: false
          }));
        } catch (err) {
          console.error("Error fetching diagnostics by type:", err);
          setLoadingCharts(prev => ({
            ...prev,
            diagnosticsType: false
          }));
        }

        // Get growth percentages
        try {
          const growthStats = await adminService.getGrowthStats();
          
          if (growthStats && growthStats.data) {
            setChartData(prev => ({
              ...prev,
              userGrowth: growthStats.data.userGrowth,
              patientGrowth: growthStats.data.patientGrowth,
              diagnosticsGrowth: growthStats.data.diagnosticsGrowth,
              monthlyGrowth: growthStats.data.monthlyGrowth
            }));
          }
        } catch (err) {
          console.error("Error fetching growth statistics:", err);
          // Keep default growth values
        }
        
        setLoading(false);
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
  }, [timeRange]); // Re-fetch when timeRange changes

  // Function to refresh dashboard data
  const refreshData = async () => {
    setLoading(true);
    setLoadingCharts({
      userRegistration: true,
      diagnosticsType: true
    });
    setError(null);
    
    try {
      // Refresh admin stats
      await adminService.getAdminStats();
      
      // Re-fetch detailed stats
      const timeRangeCopy = timeRange;
      setTimeRange(''); // Force re-render
      setTimeout(() => setTimeRange(timeRangeCopy), 10);
      
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh dashboard data");
      setLoading(false);
      setLoadingCharts({
        userRegistration: false,
        diagnosticsType: false
      });
    }
  };

  // Function to handle time range change for user registration chart
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Function to calculate percentages for diagnostics by type
  const calculatePercentages = (data) => {
    if (!data || data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0
    }));
  };

  // Function to toggle display mode (count vs percentage)
  const toggleDisplayMode = (mode) => {
    setDisplayMode(mode);
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
              <div className={`h-12 w-12 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} mb-4`}></div>
              <div className={`h-6 w-24 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded mb-2`}></div>
              <div className={`h-10 w-16 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded`}></div>
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
        {/* User Registration Chart */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">User Registration Trend</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTimeRangeChange('week')} 
                className={`px-2 py-1 text-xs rounded ${
                  timeRange === 'week' 
                    ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') 
                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                }`}
              >Week</button>
              <button 
                onClick={() => handleTimeRangeChange('month')} 
                className={`px-2 py-1 text-xs rounded ${
                  timeRange === 'month' 
                    ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') 
                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                }`}
              >Month</button>
              <button 
                onClick={() => handleTimeRangeChange('year')} 
                className={`px-2 py-1 text-xs rounded ${
                  timeRange === 'year' 
                    ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') 
                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                }`}
              >Year</button>
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
              <button 
                onClick={() => toggleDisplayMode('count')} 
                className={`px-2 py-1 text-xs rounded ${
                  displayMode === 'count' 
                    ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') 
                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                }`}
              >Count</button>
              <button 
                onClick={() => toggleDisplayMode('percentage')} 
                className={`px-2 py-1 text-xs rounded ${
                  displayMode === 'percentage' 
                    ? (isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white') 
                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                }`}
              >Percentage</button>
            </div>
          </div>
          
          {/* Diagnostics Chart - Horizontal Bar Chart */}
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
              {calculatePercentages(chartData.diagnosticsType).map((item, index) => {
                const maxCount = Math.max(...chartData.diagnosticsType.map(item => item.count));
                const width = maxCount > 0 
                  ? displayMode === 'percentage' 
                    ? `${item.percentage}%` 
                    : `${(item.count / maxCount) * 100}%`
                  : '0%';
                
                const colors = [
                  'bg-emerald-500', 'bg-purple-500', 'bg-blue-500', 
                  'bg-pink-500', 'bg-red-500', 'bg-amber-500'
                ];
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.type}</span>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {displayMode === 'percentage' 
                          ? `${item.percentage}%` 
                          : item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width }}
                        role="graphics-symbol"
                        aria-label={`${item.type}: ${item.count.toLocaleString()} diagnostics (${item.percentage}%)`}
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
    </div>
  );
};

export default AdminOverview;