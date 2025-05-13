import React, { useState, useEffect } from 'react';
import { Activity, BarChart2, Calendar, TrendingUp, TrendingDown, Layers, Download, Zap, Award } from 'lucide-react';
import adminService from '../../../services/admin.service';

const DiagnosticsAnalytics = ({ isDark }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDiagnostics: 0,
    diagnosticsLastMonth: 0,
    accuracyRate: 0,
    processingTime: 0,
    diagnosticsByModel: [],
    diagnosticsTrend: [],
    modelAccuracy: [],
    errorRates: []
  });
  
  // Fetch diagnostics analytics data
  useEffect(() => {
    const fetchDiagnosticsAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, we'd pass timeRange to the API
        const data = await adminService.getDiagnosticsAnalytics(timeRange);
        setStats(data);
      } catch (err) {
        console.error('Error fetching diagnostics analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // For demo purposes, let's simulate the API call
    const mockData = {
      totalDiagnostics: 24786,
      diagnosticsLastMonth: 2134,
      accuracyRate: 94.7,
      processingTime: 1.2,
      diagnosticsByModel: [
        { model: 'Diabetes', count: 8964, percentage: 36.2 },
        { model: 'Brain Tumor', count: 3275, percentage: 13.2 },
        { model: 'Alzheimer\'s', count: 4125, percentage: 16.6 },
        { model: 'Breast Cancer', count: 3842, percentage: 15.5 },
        { model: 'COVID-19', count: 2786, percentage: 11.2 },
        { model: 'Pneumonia', count: 1794, percentage: 7.3 }
      ],
      diagnosticsTrend: [
        { month: 'Jan', count: 1825 },
        { month: 'Feb', count: 1902 },
        { month: 'Mar', count: 1978 },
        { month: 'Apr', count: 2042 },
        { month: 'May', count: 2128 },
        { month: 'Jun', count: 2056 },
        { month: 'Jul', count: 2187 },
        { month: 'Aug', count: 2246 },
        { month: 'Sep', count: 2258 },
        { month: 'Oct', count: 2164 },
        { month: 'Nov', count: 2096 },
        { month: 'Dec', count: 2134 }
      ],
      modelAccuracy: [
        { model: 'Diabetes', accuracy: 95.2 },
        { model: 'Brain Tumor', accuracy: 94.8 },
        { model: 'Alzheimer\'s', accuracy: 93.5 },
        { model: 'Breast Cancer', accuracy: 96.1 },
        { model: 'COVID-19', accuracy: 92.4 },
        { model: 'Pneumonia', accuracy: 94.7 }
      ],
      errorRates: [
        { model: 'Diabetes', falsePositive: 2.8, falseNegative: 2.0 },
        { model: 'Brain Tumor', falsePositive: 3.1, falseNegative: 2.1 },
        { model: 'Alzheimer\'s', falsePositive: 3.5, falseNegative: 3.0 },
        { model: 'Breast Cancer', falsePositive: 2.2, falseNegative: 1.7 },
        { model: 'COVID-19', falsePositive: 4.2, falseNegative: 3.4 },
        { model: 'Pneumonia', falsePositive: 3.1, falseNegative: 2.2 }
      ]
    };
    
    // Simulate API delay
    setTimeout(() => {
      setStats(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);
  
  const handleExportReport = () => {
    // In a real app, this would trigger a download of a CSV/PDF report
    alert('This would download a diagnostics analytics report');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Diagnostics Analytics</h2>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                timeRange === 'month'
                  ? isDark ? 'bg-purple-800 text-white border-purple-700' : 'bg-purple-600 text-white border-purple-600'
                  : isDark ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeRange === 'quarter'
                  ? isDark ? 'bg-purple-800 text-white border-purple-700' : 'bg-purple-600 text-white border-purple-600'
                  : isDark ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                timeRange === 'year'
                  ? isDark ? 'bg-purple-800 text-white border-purple-700' : 'bg-purple-600 text-white border-purple-600'
                  : isDark ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? isDark ? 'border-purple-500 text-purple-400' : 'border-purple-500 text-purple-600'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('accuracy')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accuracy'
                ? isDark ? 'border-purple-500 text-purple-400' : 'border-purple-500 text-purple-600'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Accuracy Metrics
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trends'
                ? isDark ? 'border-purple-500 text-purple-400' : 'border-purple-500 text-purple-600'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Trends Analysis
          </button>
        </nav>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Diagnostics */}
            <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-10 w-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <Layers className="h-5 w-5" />
                  </div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Diagnostics</p>
                  <div className="flex items-end">
                    <p className="text-2xl font-bold mr-2">{stats.totalDiagnostics.toLocaleString()}</p>
                    <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>8.2%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Last Month */}
            <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-10 w-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Month</p>
                  <div className="flex items-end">
                    <p className="text-2xl font-bold mr-2">{stats.diagnosticsLastMonth.toLocaleString()}</p>
                    <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>4.5%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Accuracy Rate */}
            <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-10 w-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuracy Rate</p>
                  <div className="flex items-end">
                    <p className="text-2xl font-bold mr-2">{stats.accuracyRate}%</p>
                    <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>1.3%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Avg. Processing Time */}
            <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-10 w-16 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg. Processing Time</p>
                  <div className="flex items-end">
                    <p className="text-2xl font-bold mr-2">{stats.processingTime}s</p>
                    <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-0.2s</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Diagnostics by Model */}
          <div className={`p-6 rounded-lg shadow-md mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <h3 className="text-lg font-semibold mb-6">Diagnostics by Model</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className={`h-6 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {stats.diagnosticsByModel.map((model, index) => {
                  const colors = {
                    'Diabetes': 'bg-emerald-500',
                    'Brain Tumor': 'bg-purple-500',
                    'Alzheimer\'s': 'bg-blue-500',
                    'Breast Cancer': 'bg-pink-500',
                    'COVID-19': 'bg-red-500',
                    'Pneumonia': 'bg-amber-500'
                  };
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${colors[model.model] || 'bg-slate-500'} mr-2`}></div>
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{model.model}</span>
                        </div>
                        <div className="flex space-x-4">
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{model.count.toLocaleString()}</span>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{model.percentage}%</span>
                        </div>
                      </div>
                      <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${colors[model.model] || 'bg-slate-500'}`}
                          style={{ width: `${model.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Monthly Trends */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Diagnostic Trends</h3>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {timeRange === 'month' ? 'Last 30 days' : 
                timeRange === 'quarter' ? 'Last 3 months' : 'Last 12 months'}
              </span>
            </div>
            
            {loading ? (
              <div className="animate-pulse h-64">
                <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="h-full relative">
                  {/* X Axis */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                    {stats.diagnosticsTrend.map((item, index) => (
                      <div key={index} className="text-xs text-center w-8">
                        <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.month}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Line Chart */}
                  <div className="absolute inset-0 pt-4 pb-6 px-4">
                    <svg className="w-full h-full" viewBox="0 0 24 24" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={isDark ? '#a855f7' : '#a855f7'} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={isDark ? '#a855f7' : '#a855f7'} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Chart Area */}
                      <path
                        d="M0,24 L2,20 L4,18 L6,16 L8,15 L10,14 L12,12 L14,10 L16,9 L18,8 L20,7 L22,6 L24,5 L24,24 L0,24 Z"
                        fill="url(#gradient)"
                      />
                      
                      {/* Line */}
                      <path
                        d="M0,20 L2,18 L4,16 L6,15 L8,14 L10,12 L12,10 L14,9 L16,8 L18,7 L20,6 L22,5 L24,4"
                        fill="none"
                        stroke={isDark ? '#a855f7' : '#a855f7'}
                        strokeWidth="2"
                      />
                      
                      {/* Data Points */}
                      <g>
                        {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((x, i) => (
                          <circle
                            key={i}
                            cx={x}
                            cy={[20, 18, 16, 15, 14, 12, 10, 9, 8, 7, 6, 5, 4][i] || 0}
                            r="0.3"
                            fill={isDark ? '#a855f7' : '#a855f7'}
                            stroke={isDark ? '#fff' : '#fff'}
                            strokeWidth="0.1"
                          />
                        ))}
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Accuracy Metrics Tab */}
      {activeTab === 'accuracy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accuracy by Model */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <h3 className="text-lg font-semibold mb-6">Accuracy by Model</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className={`h-6 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {stats.modelAccuracy.map((model, index) => {
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{model.model}</span>
                        <span className={`text-sm font-bold ${
                          model.accuracy >= 95 
                            ? isDark ? 'text-green-400' : 'text-green-600' 
                            : model.accuracy >= 90 
                              ? isDark ? 'text-blue-400' : 'text-blue-600'
                              : isDark ? 'text-amber-400' : 'text-amber-600'
                        }`}>{model.accuracy}%</span>
                      </div>
                      <div className={`h-3 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div 
                          className={`h-3 rounded-full ${
                            model.accuracy >= 95 ? 'bg-green-500' : model.accuracy >= 90 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Error Rates */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <h3 className="text-lg font-semibold mb-6">Error Rates by Model</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className={`h-12 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {stats.errorRates.map((model, index) => {
                  return (
                    <div key={index} className="space-y-1">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{model.model}</span>
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>False Positive</span>
                          <span className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{model.falsePositive}%</span>
                        </div>
                        <div className={`h-2 w-full rounded-full mt-1 mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div 
                            className="h-2 rounded-full bg-red-500"
                            style={{ width: `${model.falsePositive * 5}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>False Negative</span>
                          <span className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{model.falseNegative}%</span>
                        </div>
                        <div className={`h-2 w-full rounded-full mt-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div 
                            className="h-2 rounded-full bg-amber-500"
                            style={{ width: `${model.falseNegative * 5}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Accuracy Trends */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors lg:col-span-2`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Accuracy Trends</h3>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {timeRange === 'month' ? 'Last 30 days' : 
                timeRange === 'quarter' ? 'Last 3 months' : 'Last 12 months'}
              </span>
            </div>
            
            {loading ? (
              <div className="animate-pulse h-64">
                <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="h-full relative">
                  {/* Placeholder for accuracy trend chart */}
                  <div className={`h-full w-full flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded`}>
                    <div className="text-center">
                      <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Line chart showing accuracy trends over time</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Trends Analysis Tab */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Patterns */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <h3 className="text-lg font-semibold mb-6">Usage Patterns by Time of Day</h3>
            
            {loading ? (
              <div className="animate-pulse h-64">
                <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="h-full relative">
                  {/* Placeholder for usage pattern chart */}
                  <div className={`h-full w-full flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded`}>
                    <div className="text-center">
                      <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Bar chart showing usage patterns by time of day</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Model Popularity */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
            <h3 className="text-lg font-semibold mb-6">Model Popularity Trends</h3>
            
            {loading ? (
              <div className="animate-pulse h-64">
                <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="h-full relative">
                  {/* Placeholder for model popularity chart */}
                  <div className={`h-full w-full flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded`}>
                    <div className="text-center">
                      <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Line chart showing popularity trends for each model</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Performance Metrics */}
          <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors lg:col-span-2`}>
            <h3 className="text-lg font-semibold mb-6">System Performance Metrics</h3>
            
            {loading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-2">
                      <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                      <div className={`h-20 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Average Response Time */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Avg. Response Time</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">1.2s</p>
                    <div className={`text-xs flex items-center justify-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-0.2s from last period</span>
                    </div>
                  </div>
                </div>
                
                {/* Server Load */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Server Load</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">42%</p>
                    <div className={`text-xs flex items-center justify-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-5% from last period</span>
                    </div>
                  </div>
                </div>
                
                {/* API Requests */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>API Requests/Day</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">4.8k</p>
                    <div className={`text-xs flex items-center justify-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12% from last period</span>
                    </div>
                  </div>
                </div>
                
                {/* Error Rate */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>System Error Rate</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">0.3%</p>
                    <div className={`text-xs flex items-center justify-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-0.1% from last period</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Export Button - Bottom */}
      <div className="mt-6 text-right">
        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ml-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Detailed Report
        </button>
      </div>
    </div>
  );
};

export default DiagnosticsAnalytics;