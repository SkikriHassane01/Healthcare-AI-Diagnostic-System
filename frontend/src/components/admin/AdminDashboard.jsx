import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import adminService from '../../services/admin.service';

// Import admin components
import AdminHeader from './layout/AdminHeader';
import AdminSidebar from './layout/AdminSidebar';
import AdminFooter from './layout/AdminFooter';
import AdminOverview from './views/AdminOverview';
import UserManagement from './views/UserManagement';
import PatientAnalytics from './views/PatientAnalytics';
import DiagnosticsAnalytics from './views/DiagnosticsAnalytics';
import SystemSettings from './views/SystemSettings';
import ReportGenerator from './views/ReportGenerator';

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({
    userCount: 0,
    patientCount: 0,
    totalDiagnostics: 0,
    lastMonthDiagnostics: 0,
  });

  // Page titles
  const titles = {
    overview: 'Admin Dashboard',
    users: 'User Management',
    patients: 'Patient Analytics',
    diagnostics: 'Diagnostics Analytics',
    settings: 'System Settings',
    reports: 'Report Generator',
  };

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userIsAdmin = authService.isAdmin();
        if (!userIsAdmin) {
          navigate('/dashboard'); // Redirect to regular dashboard if not admin
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        navigate('/login');
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch initial admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only automatically open the sidebar on resize if transitioning from mobile to desktop
      if (!mobile && isMobile) {
        setIsSidebarOpen(true);
      }
      // Auto-close sidebar when transitioning to mobile
      if (mobile && !isMobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const onLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Render current view
  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement isDark={isDark} />;
      case 'patients':
        return <PatientAnalytics isDark={isDark} />;
      case 'diagnostics':
        return <DiagnosticsAnalytics isDark={isDark} />;
      case 'settings':
        return <SystemSettings isDark={isDark} />;
      case 'reports':
        return <ReportGenerator isDark={isDark} />;
      default:
        return <AdminOverview isDark={isDark} stats={stats} loading={loading} />;
    }
  };

  // Get current user
  const currentUser = authService.getCurrentUser();
  const userInitials = currentUser ? `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}` : 'AD';
  const userName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Admin User';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'} transition-colors`}>
      <AdminSidebar
        isDark={isDark}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        activeView={activeView}
        setActiveView={setActiveView}
        toggleSidebar={toggleSidebar}
        onLogout={onLogout}
      />

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <AdminHeader
          isDark={isDark}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle={titles[activeView] || titles.overview}
          userInitials={userInitials}
          userName={userName}
        />

        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
        
        <AdminFooter isDark={isDark} />
      </div>
    </div>
  );
};

export default AdminDashboard;