import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/auth.service';

/**
 * A wrapper for routes that should only be accessible to authenticated users
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ requireAdmin = false }) => {
  // Check if user is logged in
  const isAuthenticated = authService.isLoggedIn();
  
  // Check if user is admin (if required)
  const isAdmin = authService.isAdmin();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If admin is required but user is not admin, redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;