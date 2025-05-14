import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const { isDark } = useTheme();
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'doctor', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    // Check all required fields
    if (!formData.username || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.first_name || !formData.last_name || !formData.role) {
      setError('All fields are required');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password length check
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // Password match check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      // Attempt to register
      await authService.register(userData);
      
      // Check if registered user is admin and redirect accordingly
      if (userData.role === 'admin' || authService.isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Show error message
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-4 transition-colors duration-300`}>
      <div className={`max-w-md w-full ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg p-8 border`}>
        <h2 className={`text-center text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Create your account
        </h2>
        
        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="first_name" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label htmlFor="last_name" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              } bg-none`}
            >
              <option value="doctor">Doctor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Must be at least 8 characters
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className={`block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-sky-500/50 outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 dark:hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;