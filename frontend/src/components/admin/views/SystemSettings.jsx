import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertCircle, Check, Settings, Database, Shield, HardDrive, Server, Users, RefreshCw } from 'lucide-react';
import adminService from '../../../services/admin.service';

const SystemSettings = ({ isDark }) => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'HealthAI Diagnostic System',
      adminEmail: 'admin@healthai.com',
      maxUploadSize: 25,
      defaultLanguage: 'en',
      timeZone: 'UTC',
      sessionTimeout: 30
    },
    security: {
      passwordExpiry: 90,
      passwordComplexity: 'high',
      twoFactorAuth: false,
      loginAttempts: 5,
      ipWhitelist: '',
      enableGoogleAuth: false
    },
    database: {
      backupFrequency: 'daily',
      backupRetention: 30,
      optimizationSchedule: 'weekly',
      maintenanceWindow: '01:00:00',
      logQueries: false,
      maxConnections: 100
    },
    models: {
      cachingEnabled: true,
      batchProcessing: false,
      maxQueueSize: 500,
      processingTimeout: 60,
      failureRetries: 3,
      diagnosticLogLevel: 'error'
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      dailyReports: true,
      errorReporting: true,
      userRegistration: true,
      maintenanceAlerts: true
    }
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch from the API
        // const data = await adminService.getSystemSettings();
        // setSettings(data);
        
        // For demo, simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching system settings:', err);
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle changes to settings
  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (category, setting, e) => {
    handleChange(category, setting, e.target.checked);
  };
  
  // Handle text/number input changes
  const handleInputChange = (category, setting, e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    handleChange(category, setting, value);
  };
  
  // Handle select changes
  const handleSelectChange = (category, setting, e) => {
    handleChange(category, setting, e.target.value);
  };
  
  // Handle save
  const handleSave = async () => {
    setSaveLoading(true);
    
    try {
      // In a real app, this would call the API
      // await adminService.updateSystemSettings(settings);
      
      // Simulate API delay
      setTimeout(() => {
        setSaveLoading(false);
        alert('Settings saved successfully!');
      }, 1500);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveLoading(false);
      alert('Error saving settings. Please try again.');
    }
  };
  
  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings? This action cannot be undone.')) {
      // In a real app, this would reset to system defaults
      // For demo, just reload the page
      window.location.reload();
    }
  };
  
  // Spinner component for loading states
  const Spinner = () => (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className={`animate-spin h-8 w-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
    </div>
  );
  
  if (loading) {
    return (
      <div className={`rounded-lg shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
        <h2 className="text-2xl font-bold mb-4">System Settings</h2>
        <Spinner />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className={`py-2 px-4 rounded-md flex items-center ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`py-2 px-4 rounded-md flex items-center ${
              saveLoading 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500'
            } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            {saveLoading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <Settings className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                System Name
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleInputChange('general', 'siteName', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Admin Email
              </label>
              <input
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => handleInputChange('general', 'adminEmail', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.general.maxUploadSize}
                onChange={(e) => handleInputChange('general', 'maxUploadSize', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Default Language
              </label>
              <select
                value={settings.general.defaultLanguage}
                onChange={(e) => handleSelectChange('general', 'defaultLanguage', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Time Zone
              </label>
              <select
                value={settings.general.timeZone}
                onChange={(e) => handleSelectChange('general', 'timeZone', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.general.sessionTimeout}
                onChange={(e) => handleInputChange('general', 'sessionTimeout', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <Shield className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleInputChange('security', 'passwordExpiry', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Password Complexity
              </label>
              <select
                value={settings.security.passwordComplexity}
                onChange={(e) => handleSelectChange('security', 'passwordComplexity', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="low">Low (letters only)</option>
                <option value="medium">Medium (letters + numbers)</option>
                <option value="high">High (letters, numbers, symbols)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleCheckboxChange('security', 'twoFactorAuth', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Two-Factor Authentication
              </label>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => handleInputChange('security', 'loginAttempts', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                IP Whitelist (comma separated)
              </label>
              <input
                type="text"
                value={settings.security.ipWhitelist}
                onChange={(e) => handleInputChange('security', 'ipWhitelist', e)}
                placeholder="e.g. 192.168.1.1, 10.0.0.1"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableGoogleAuth"
                checked={settings.security.enableGoogleAuth}
                onChange={(e) => handleCheckboxChange('security', 'enableGoogleAuth', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="enableGoogleAuth" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Google Authentication
              </label>
            </div>
          </div>
        </div>
        
        {/* Database Settings */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <Database className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">Database Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Backup Frequency
              </label>
              <select
                value={settings.database.backupFrequency}
                onChange={(e) => handleSelectChange('database', 'backupFrequency', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Backup Retention (days)
              </label>
              <input
                type="number"
                value={settings.database.backupRetention}
                onChange={(e) => handleInputChange('database', 'backupRetention', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Optimization Schedule
              </label>
              <select
                value={settings.database.optimizationSchedule}
                onChange={(e) => handleSelectChange('database', 'optimizationSchedule', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Maintenance Window (24h format)
              </label>
              <input
                type="time"
                value={settings.database.maintenanceWindow}
                onChange={(e) => handleInputChange('database', 'maintenanceWindow', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logQueries"
                checked={settings.database.logQueries}
                onChange={(e) => handleCheckboxChange('database', 'logQueries', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="logQueries" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Query Logging
              </label>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Max Connections
              </label>
              <input
                type="number"
                value={settings.database.maxConnections}
                onChange={(e) => handleInputChange('database', 'maxConnections', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
        
        {/* AI Models Settings */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <HardDrive className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">AI Model Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cachingEnabled"
                checked={settings.models.cachingEnabled}
                onChange={(e) => handleCheckboxChange('models', 'cachingEnabled', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="cachingEnabled" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Model Result Caching
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="batchProcessing"
                checked={settings.models.batchProcessing}
                onChange={(e) => handleCheckboxChange('models', 'batchProcessing', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="batchProcessing" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Batch Processing
              </label>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Max Queue Size
              </label>
              <input
                type="number"
                value={settings.models.maxQueueSize}
                onChange={(e) => handleInputChange('models', 'maxQueueSize', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Processing Timeout (seconds)
              </label>
              <input
                type="number"
                value={settings.models.processingTimeout}
                onChange={(e) => handleInputChange('models', 'processingTimeout', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Failure Retries
              </label>
              <input
                type="number"
                value={settings.models.failureRetries}
                onChange={(e) => handleInputChange('models', 'failureRetries', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                Diagnostic Log Level
              </label>
              <select
                value={settings.models.diagnosticLogLevel}
                onChange={(e) => handleSelectChange('models', 'diagnosticLogLevel', e)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <Server className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleCheckboxChange('notifications', 'emailNotifications', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="emailNotifications" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="systemAlerts"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => handleCheckboxChange('notifications', 'systemAlerts', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="systemAlerts" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                System Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dailyReports"
                checked={settings.notifications.dailyReports}
                onChange={(e) => handleCheckboxChange('notifications', 'dailyReports', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="dailyReports" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Daily Reports
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="errorReporting"
                checked={settings.notifications.errorReporting}
                onChange={(e) => handleCheckboxChange('notifications', 'errorReporting', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="errorReporting" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Error Reporting
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userRegistration"
                checked={settings.notifications.userRegistration}
                onChange={(e) => handleCheckboxChange('notifications', 'userRegistration', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="userRegistration" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                User Registration Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceAlerts"
                checked={settings.notifications.maintenanceAlerts}
                onChange={(e) => handleCheckboxChange('notifications', 'maintenanceAlerts', e)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="maintenanceAlerts" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Maintenance Alerts
              </label>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="flex items-center mb-4">
            <Users className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className="text-lg font-semibold">System Status</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>API Status</span>
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Operational
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Database</span>
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Connected
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>File Storage</span>
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Operational
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>ML Services</span>
              <span className="flex items-center text-amber-500">
                <AlertCircle className="h-4 w-4 mr-1" />
                Maintenance
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Service</span>
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Operational
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Authentication</span>
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Operational
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Last System Update</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>May 10, 2025, 03:45 AM</span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Current Version</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>v2.4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className={`py-2 px-4 rounded-md flex items-center ${
            saveLoading 
              ? 'bg-purple-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500'
          } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
          {saveLoading ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;