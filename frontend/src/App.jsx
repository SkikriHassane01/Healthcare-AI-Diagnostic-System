import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext'

// Import authentication components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';

// Import pages
import LandingPage from './pages/LandingPage';

// Import patient components
import PatientList from './components/patients/PatientList';
import PatientDetail from './components/patients/PatientDetail';
import PatientForm from './components/patients/PatientForm';

// Import diagnostic components
import DiabetesForm from './components/diagnostics/diabetes/DiabetesForm';
import DiabetesHistory from './components/diagnostics/diabetes/DiabetesHistory';
import AlzheimerForm from './components/diagnostics/alzheimer/AlzheimerForm';
import AlzheimerHistory from './components/diagnostics/alzheimer/AlzheimerHistory';
import BreastCancerForm from './components/diagnostics/breastCancer/BreastCancerForm';
import BreastCancerHistory from './components/diagnostics/breastCancer/BreastCancerHistory';

// Placeholder pages (will be replaced in later phases)
const ProfilePage = () => <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-300">User Profile (Coming Soon)</div>;
const BrainTumorPage = () => <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-300">Brain Tumor Detection Tool (Coming Soon)</div>;
const AdminPage = () => <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-300">Admin Dashboard (Coming Soon)</div>;

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
    <h1 className="text-4xl font-bold mb-2">404</h1>
    <p className="text-slate-600 dark:text-slate-300 mb-6">Page not found</p>
    <a 
      href="/" 
      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
    >
      Go Home
    </a>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes for authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Patient Management Routes */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm mode="create" />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/edit" element={<PatientForm mode="edit" />} />
            
            {/* Diagnostic Routes */}

            {/* Add Diabetes Routes */}
            <Route path="/patients/:patientId/diabetes-assessment" element={<DiabetesForm />} />
            <Route path="/patients/:patientId/diabetes-history" element={<DiabetesHistory />} />
            
            {/* Add Breast Cancer Routes */}
            <Route path="/patients/:patientId/breast-cancer-assessment" element={<BreastCancerForm />} /> 
            <Route path="/patients/:patientId/breast-cancer-history" element={<BreastCancerHistory />} />
            
            {/* Alzheimer Routes */}
            <Route path="/patients/:patientId/alzheimer-assessment" element={<AlzheimerForm />} />
            <Route path="/patients/:patientId/alzheimer-history" element={<AlzheimerHistory />} />
          </Route>
          
          {/* Admin-only routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;