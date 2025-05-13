import React, { useState, useEffect } from 'react';
import { Calendar, Users, Filter, BarChart2, Download, ArrowUpRight, ChevronDown } from 'lucide-react';
import adminService from '../../../services/admin.service';

const PatientAnalytics = ({ isDark }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatientsLastMonth: 0,
    averageAge: 0,
    patientsByGender: { male: 0, female: 0, other: 0 },
    patientRegistrationByMonth: [],
    patientsByAgeGroup: [],
    patientsWithConditions: []
  });
  const [timeRange, setTimeRange] = useState('year');
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  
  // Fetch patient analytics data
  useEffect(() => {
    const fetchPatientAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, we'd pass timeRange to the API
        const data = await adminService.getPatientAnalytics(timeRange);
        setStats(data);
      } catch (err) {
        console.error('Error fetching patient analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientAnalytics();
  }, [timeRange]);
  
  // For demo purposes, we'll use mock data since we don't have a real API
  useEffect(() => {
    // Simulating API response
    const mockData = {
      totalPatients: 2742,
      newPatientsLastMonth: 168,
      averageAge: 47.5,
      patientsByGender: { male: 1350, female: 1380, other: 12 },
      patientRegistrationByMonth: [
        { month: 'Jan', count: 142 },
        { month: 'Feb', count: 156 },
        { month: 'Mar', count: 178 },
        { month: 'Apr', count: 165 },
        { month: 'May', count: 196 },
        { month: 'Jun', count: 187 },
        { month: 'Jul', count: 203 },
        { month: 'Aug', count: 221 },
        { month: 'Sep', count: 243 },
        { month: 'Oct', count: 235 },
        { month: 'Nov', count: 258 },
        { month: 'Dec', count: 275 }
      ],
      patientsByAgeGroup: [
        { group: '0-17', count: 312 },
        { group: '18-34', count: 648 },
        { group: '35-50', count: 825 },
        { group: '51-65', count: 657 },
        { group: '66+', count: 300 }
      ],
      patientsWithConditions: [
        { condition: 'Diabetes', count: 584, percentage: 21.3 },
        { condition: 'Brain Tumor', count: 127, percentage: 4.6 },
        { condition: 'Alzheimer', count: 218, percentage: 7.9 },
        { condition: 'Breast Cancer', count: 172, percentage: 6.3 },
        { condition: 'COVID-19', count: 395, percentage: 14.4 },
        { condition: 'Pneumonia', count: 276, percentage: 10.1 }
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
    alert('This would download a patient analytics report');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Patient Analytics</h2>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Time Range Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
              className={`px-4 py-2 flex items-center justify-between w-full rounded-md border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {timeRange === 'month' ? 'Last Month' : 
               timeRange === 'quarter' ? 'Last Quarter' : 
               timeRange === 'year' ? 'Last Year' : 'All Time'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            {isTimeRangeOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                isDark ? 'bg-slate-800 ring-1 ring-black ring-opacity-5' : 'bg-white ring-1 ring-black ring-opacity-5'
              }`}>
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {['month', 'quarter', 'year', 'all'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setIsTimeRangeOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        timeRange === range
                          ? isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
                          : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      role="menuitem"
                    >
                      {range === 'month' ? 'Last Month' : 
                       range === 'quarter' ? 'Last Quarter' : 
                       range === 'year' ? 'Last Year' : 'All Time'}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients */}
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
                <Users className="h-5 w-5" />
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Patients</p>
              <div className="flex items-end">
                <p className="text-2xl font-bold mr-2">{stats.totalPatients.toLocaleString()}</p>
                <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>6.2%</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* New Patients */}
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
                <Calendar className="h-5 w-5" />
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>New Patients (Last Month)</p>
              <div className="flex items-end">
                <p className="text-2xl font-bold mr-2">{stats.newPatientsLastMonth.toLocaleString()}</p>
                <div className={`text-xs mb-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>12.8%</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Average Age */}
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
                <BarChart2 className="h-5 w-5" />
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Age</p>
              <p className="text-2xl font-bold">{stats.averageAge} years</p>
            </>
          )}
        </div>
        
        {/* Gender Distribution */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              <div className={`h-6 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              <div className={`h-10 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Filter className="h-5 w-5" />
              </div>
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gender Distribution</p>
              <div className="flex h-8 rounded-md overflow-hidden">
                {/* Calculate percentages */}
                {stats.patientsByGender && (
                  <>
                    <div 
                      className="bg-blue-500" 
                      style={{ 
                        width: `${(stats.patientsByGender.male / (stats.patientsByGender.male + stats.patientsByGender.female + stats.patientsByGender.other)) * 100}%` 
                      }}
                      title={`Male: ${stats.patientsByGender.male}`}
                    ></div>
                    <div 
                      className="bg-pink-500" 
                      style={{ 
                        width: `${(stats.patientsByGender.female / (stats.patientsByGender.male + stats.patientsByGender.female + stats.patientsByGender.other)) * 100}%` 
                      }}
                      title={`Female: ${stats.patientsByGender.female}`}
                    ></div>
                    <div 
                      className="bg-purple-500" 
                      style={{ 
                        width: `${(stats.patientsByGender.other / (stats.patientsByGender.male + stats.patientsByGender.female + stats.patientsByGender.other)) * 100}%` 
                      }}
                      title={`Other: ${stats.patientsByGender.other}`}
                    ></div>
                  </>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Male</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-500 rounded-full mr-1"></div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Female</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-purple-500 rounded-full mr-1"></div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Other</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Patient Registration Trends */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          <h3 className="text-lg font-semibold mb-6">Patient Registration Trends</h3>
          
          {loading ? (
            <div className="animate-pulse h-64">
              <div className={`h-full w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            </div>
          ) : (
            <div className="h-64">
              <div className="h-full relative">
                {/* X Axis */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                  {stats.patientRegistrationByMonth && stats.patientRegistrationByMonth.map((item, index) => (
                    <div key={index} className="text-xs text-center w-8">
                      <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.month}</span>
                    </div>
                  ))}
                </div>
                
                {/* Bars */}
                <div className="absolute bottom-5 top-0 left-0 right-0 flex justify-between items-end">
                  {stats.patientRegistrationByMonth && stats.patientRegistrationByMonth.map((item, index) => {
                    const maxCount = Math.max(...stats.patientRegistrationByMonth.map(i => i.count));
                    const height = `${(item.count / maxCount) * 100}%`;
                    return (
                      <div key={index} className="w-6 flex justify-center">
                        <div 
                          className="w-4 rounded-t-sm bg-purple-500 bg-opacity-80 hover:bg-opacity-100 transition-all"
                          style={{ height }}
                          title={`${item.month}: ${item.count} patients`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Age Distribution */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
          <h3 className="text-lg font-semibold mb-6">Age Distribution</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="space-y-2">
                  <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-6 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats.patientsByAgeGroup && stats.patientsByAgeGroup.map((group, index) => {
                const maxCount = Math.max(...stats.patientsByAgeGroup.map(g => g.count));
                const width = `${(group.count / maxCount) * 100}%`;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{group.group} years</span>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{group.count}</span>
                    </div>
                    <div className={`h-6 w-full rounded-md ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div 
                        className={`h-6 rounded-md ${colors[index % colors.length]}`}
                        style={{ width }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Disease Distribution */}
      <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors mb-6`}>
        <h3 className="text-lg font-semibold mb-6">Diagnostic Distribution</h3>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="space-y-2">
                  <div className={`h-4 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-20 w-full rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.patientsWithConditions && stats.patientsWithConditions.map((condition, index) => {
              const colors = {
                'Diabetes': { bg: 'bg-emerald-500', text: 'text-emerald-500' },
                'Brain Tumor': { bg: 'bg-purple-500', text: 'text-purple-500' },
                'Alzheimer': { bg: 'bg-blue-500', text: 'text-blue-500' },
                'Breast Cancer': { bg: 'bg-pink-500', text: 'text-pink-500' },
                'COVID-19': { bg: 'bg-red-500', text: 'text-red-500' },
                'Pneumonia': { bg: 'bg-amber-500', text: 'text-amber-500' }
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <h4 className={`text-lg font-medium mb-2 ${colors[condition.condition]?.text || 'text-slate-700'}`}>
                    {condition.condition}
                  </h4>
                  
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {condition.count} patients
                    </span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {condition.percentage}%
                    </span>
                  </div>
                  
                  <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    <div 
                      className={`h-2 rounded-full ${colors[condition.condition]?.bg || 'bg-slate-500'}`}
                      style={{ width: `${condition.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Export Button - Bottom Sticky */}
      <div className="text-right">
        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ml-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Detailed Analytics
        </button>
      </div>
    </div>
  );
};

export default PatientAnalytics;