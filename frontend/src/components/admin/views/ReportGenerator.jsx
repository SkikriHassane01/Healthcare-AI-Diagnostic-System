import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, Share2, FileText, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import adminService from '../../../services/admin.service';

const ReportGenerator = ({ isDark }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedModels, setSelectedModels] = useState({
    diabetes: true,
    brainTumor: true,
    alzheimer: true,
    breastCancer: true,
    covid: true,
    pneumonia: true
  });
  const [reportFormats, setReportFormats] = useState({
    pdf: true,
    csv: false,
    excel: false
  });
  const [lastReports, setLastReports] = useState([]);

  // Sample last reports for demo
  useEffect(() => {
    setLastReports([
      { 
        id: 1, 
        name: 'Monthly Summary Report', 
        date: '2025-05-01', 
        type: 'summary', 
        format: 'pdf', 
        size: '2.4 MB' 
      },
      { 
        id: 2, 
        name: 'User Activity Report', 
        date: '2025-04-15', 
        type: 'user', 
        format: 'excel', 
        size: '3.7 MB' 
      },
      { 
        id: 3, 
        name: 'Diagnostic Performance Report', 
        date: '2025-04-01', 
        type: 'diagnostic', 
        format: 'pdf', 
        size: '5.2 MB' 
      },
      { 
        id: 4, 
        name: 'Patient Data Export', 
        date: '2025-03-15', 
        type: 'patient', 
        format: 'csv', 
        size: '8.1 MB' 
      }
    ]);
  }, []);

  // Prepare date inputs based on selected range
  useEffect(() => {
    const today = new Date();
    let startDate = new Date();
    
    if (dateRange === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (dateRange === 'quarter') {
      startDate.setMonth(today.getMonth() - 3);
    } else if (dateRange === 'year') {
      startDate.setFullYear(today.getFullYear() - 1);
    }
    
    setCustomStartDate(startDate.toISOString().split('T')[0]);
    setCustomEndDate(today.toISOString().split('T')[0]);
  }, [dateRange]);

  const handleModelToggle = (model) => {
    setSelectedModels({
      ...selectedModels,
      [model]: !selectedModels[model]
    });
  };

  const handleFormatToggle = (format) => {
    setReportFormats({
      ...reportFormats,
      [format]: !reportFormats[format]
    });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    
    // Prepare report configuration
    const reportConfig = {
      reportType,
      dateRange: dateRange === 'custom' ? 'custom' : dateRange,
      startDate: customStartDate,
      endDate: customEndDate,
      includeInactive,
      models: Object.keys(selectedModels).filter(key => selectedModels[key]),
      formats: Object.keys(reportFormats).filter(key => reportFormats[key])
    };
    
    try {
      // In a real app, this would call the API
      console.log('Generating report with config:', reportConfig);
      
      // Simulate API delay
      setTimeout(() => {
        // Add new report to the list
        const newReport = {
          id: lastReports.length + 1,
          name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          date: new Date().toISOString().split('T')[0],
          type: reportType,
          format: Object.keys(reportFormats).filter(key => reportFormats[key])[0] || 'pdf',
          size: ((Math.random() * 10) + 1).toFixed(1) + ' MB'
        };
        
        setLastReports([newReport, ...lastReports]);
        setLoading(false);
        
        // Simulate download
        alert(`Report generated! In a real app, this would download a ${newReport.format.toUpperCase()} file.`);
      }, 2000);
    } catch (err) {
      console.error('Error generating report:', err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Report Generator</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration Panel */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h3 className="text-lg font-semibold mb-6">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Type */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="summary">Summary Report</option>
                <option value="user">User Activity Report</option>
                <option value="patient">Patient Data Report</option>
                <option value="diagnostic">Diagnostic Performance Report</option>
                <option value="analytics">Analytics Report</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6">
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Include Models
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="diabetes"
                  checked={selectedModels.diabetes}
                  onChange={() => handleModelToggle('diabetes')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="diabetes" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Diabetes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="brainTumor"
                  checked={selectedModels.brainTumor}
                  onChange={() => handleModelToggle('brainTumor')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="brainTumor" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Brain Tumor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alzheimer"
                  checked={selectedModels.alzheimer}
                  onChange={() => handleModelToggle('alzheimer')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="alzheimer" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Alzheimer's
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="breastCancer"
                  checked={selectedModels.breastCancer}
                  onChange={() => handleModelToggle('breastCancer')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="breastCancer" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Breast Cancer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="covid"
                  checked={selectedModels.covid}
                  onChange={() => handleModelToggle('covid')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="covid" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  COVID-19
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pneumonia"
                  checked={selectedModels.pneumonia}
                  onChange={() => handleModelToggle('pneumonia')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="pneumonia" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Pneumonia
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Report Format
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pdf"
                  checked={reportFormats.pdf}
                  onChange={() => handleFormatToggle('pdf')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="pdf" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  PDF
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="csv"
                  checked={reportFormats.csv}
                  onChange={() => handleFormatToggle('csv')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="csv" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  CSV
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="excel"
                  checked={reportFormats.excel}
                  onChange={() => handleFormatToggle('excel')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="excel" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Excel
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeInactive"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="includeInactive" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Include inactive users and archived patients
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="-ml-1 mr-2 h-5 w-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Recent Reports */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
          
          <div className="space-y-4">
            {lastReports.map(report => (
              <div 
                key={report.id} 
                className={`p-4 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'} transition-colors cursor-pointer`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-md ${
                    report.format === 'pdf' ? 'bg-red-100 text-red-600' :
                    report.format === 'csv' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  } mr-3 flex-shrink-0`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.name}</h4>
                    <div className="flex justify-between mt-1">
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(report.date).toLocaleDateString()} · {report.size}
                      </p>
                      <div className={`text-xs uppercase font-medium ${
                        report.format === 'pdf' ? isDark ? 'text-red-400' : 'text-red-600' :
                        report.format === 'csv' ? isDark ? 'text-green-400' : 'text-green-600' :
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {report.format}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-500' : 'hover:bg-slate-200'} transition-colors`}>
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className={`p-1 rounded ${isDark ? 'hover:bg-slate-500' : 'hover:bg-slate-200'} transition-colors`}>
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {lastReports.length === 0 && (
            <div className={`p-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FileText className="h-12 w-12 mx-auto opacity-50 mb-3" />
              <p>No reports generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;