import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const Dashboard = () => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Healthcare AI Diagnostic System
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-medium">{user?.full_name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Dashboard title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patients card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Patients</h3>
              <p className="text-gray-600 mb-4">
                Manage patient profiles and medical records
              </p>
              <Link
                to="/patients"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Patients
              </Link>
            </div>
          </div>
          
          {/* Diabetes diagnostics card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Diabetes Screening</h3>
              <p className="text-gray-600 mb-4">
                Run diabetes prediction using patient data
              </p>
              <Link
                to="/diagnostics/diabetes"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Screening
              </Link>
            </div>
          </div>
          
          {/* Brain tumor diagnostics card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brain Tumor Detection</h3>
              <p className="text-gray-600 mb-4">
                Analyze brain scans for tumor detection
              </p>
              <Link
                to="/diagnostics/brain-tumor"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Analysis
              </Link>
            </div>
          </div>
          
          {/* Profile card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 mb-4">
                Update your personal information and password
              </p>
              <Link
                to="/profile"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          
          {/* Admin panel - only visible to admins */}
          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Panel</h3>
                <p className="text-gray-600 mb-4">
                  System administration and user management
                </p>
                <Link
                  to="/admin"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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