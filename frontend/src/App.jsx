import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import authentication components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';

// Import auth service
import authService from './services/auth.service';

// Simple placeholder components for routes
const Home = () => {
  // If logged in, redirect to dashboard
  if (authService.isLoggedIn()) {
    return <Navigate to="/dashboard" />;
  }
  
  // Simple welcome page with links to auth pages
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Healthcare AI Diagnostic System
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Advanced diagnostic tools powered by artificial intelligence
      </p>
      <div className="flex space-x-4">
        <a 
          href="/login" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </a>
        <a 
          href="/register" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Register
        </a>
      </div>
    </div>
  );
};

// Placeholder pages (will be replaced in later phases)
const ProfilePage = () => <div className="p-8">User Profile (Coming Soon)</div>;
const PatientsPage = () => <div className="p-8">Patients Management (Coming Soon)</div>;
const DiabetesPage = () => <div className="p-8">Diabetes Screening Tool (Coming Soon)</div>;
const BrainTumorPage = () => <div className="p-8">Brain Tumor Detection Tool (Coming Soon)</div>;
const AdminPage = () => <div className="p-8">Admin Dashboard (Coming Soon)</div>;

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
    <p className="text-gray-600 mb-6">Page not found</p>
    <a 
      href="/" 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go Home
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/diagnostics/diabetes" element={<DiabetesPage />} />
          <Route path="/diagnostics/brain-tumor" element={<BrainTumorPage />} />
        </Route>
        
        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;