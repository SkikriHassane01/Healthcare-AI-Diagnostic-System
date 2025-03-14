import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const Login = () => {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form inputs
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Attempt to login
      await authService.login(username, password);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      // Show error message
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-center text-2xl font-bold mb-6">
          Sign in to your account
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your username or email"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;