import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../layout/ThemeToggle';

const Dashboard = () => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  
  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const response = await authService.getProfile();
        setUser(response.user);
      } catch (error) {
        setError('Failed to load user profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Healthcare AI Diagnostic System
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Welcome, <span className="font-medium">{user?.full_name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md shadow-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Dashboard title */}
        <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>Dashboard</h2>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patients card */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg overflow-hidden border`}>
            <div className="p-6">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Patients</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Manage patient profiles and medical records
              </p>
              <Link
                to="/patients"
                className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
              >
                View Patients
              </Link>
            </div>
          </div>
          
          {/* Diabetes diagnostics card */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg overflow-hidden border`}>
            <div className="p-6">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Diabetes Screening</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Run diabetes prediction using patient data
              </p>
              <Link
                to="/diagnostics/diabetes"
                className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
              >
                Start Screening
              </Link>
            </div>
          </div>
          
          {/* Brain tumor diagnostics card */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg overflow-hidden border`}>
            <div className="p-6">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Brain Tumor Detection</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Analyze brain scans for tumor detection
              </p>
              <Link
                to="/diagnostics/brain-tumor"
                className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
              >
                Start Analysis
              </Link>
            </div>
          </div>
          
          {/* Profile card */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg overflow-hidden border`}>
            <div className="p-6">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>My Profile</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Update your personal information and password
              </p>
              <Link
                to="/profile"
                className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          
          {/* Admin panel - only visible to admins */}
          {user?.role === 'admin' && (
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg overflow-hidden border`}>
              <div className="p-6">
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Admin Panel</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                  System administration and user management
                </p>
                <Link
                  to="/admin"
                  className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;