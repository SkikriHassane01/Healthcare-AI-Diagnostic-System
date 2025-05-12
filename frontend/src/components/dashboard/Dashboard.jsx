import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/auth.service';
import patientService from '../../services/patient.service';

// Layout Components
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

// View Components
import Overview from './views/Overview';
import PatientOverview from './views/PatientOverview';
import DiabetesView from './views/DiabetesView';
import BrainTumorView from './views/BrainTumorView';
import AlzheimerView from './views/AlzheimerView';
import BreastCancerView from './views/BreastCancerView';
import Covid19View from './views/Covid19View';
import PneumoniaView from './views/PneumoniaView';

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // User & data
  const [currentUser, setCurrentUser] = useState({ first_name: 'Guest', last_name: 'User' });
  const [patientCount, setPatientCount] = useState(0);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Page titles
  const titles = {
    overview: 'Dashboard',
    patients: 'Patient Management',
    diabetes: 'Diabetes Analytics',
    'brain-tumor': 'Brain Tumor Detection',
    alzheimer: "Alzheimer's Disease Detection",
    'breast-cancer': 'Breast Cancer Detection',
    covid: 'COVID-19 Detection',
    pneumonia: 'Pneumonia Detection',
  };

  // Page descriptions
  const descriptions = {
    overview: 'Access all diagnostic tools and patient information from this central dashboard.',
    patients: 'Manage patient records, add new patients, and review patient history.',
    diabetes: 'Analyze patient data to predict diabetes risk using tabular data models.',
    'brain-tumor': 'Upload and analyze brain MRI images to detect potential tumors.',
    alzheimer: "Evaluate brain scans for signs of Alzheimer's disease progression.",
    'breast-cancer': 'Analyze patient data to predict breast cancer risk using various parameters.',
    covid: 'Upload chest X-rays to detect potential COVID-19 infection markers.',
    pneumonia: 'Analyze chest X-rays to detect potential pneumonia cases.',
  };

  // Handle clicks outside the sidebar to close it (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          backdropRef.current && 
          backdropRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  useEffect(() => {
    // fetch user info
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);

    // fetch patients data
    (async () => {
      setLoading(true);
      try {
        const res = await patientService.getPatients({ page: 1, per_page: 5 });
        if (res.pagination) {
          setPatientCount(res.pagination.total);
          setRecentPatients(res.patients);
        }
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    })();

    // handle resize
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

  const getInitials = () =>
    currentUser.first_name && currentUser.last_name
      ? `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}`
      : 'GU';

  const getFullName = () =>
    currentUser.first_name && currentUser.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : 'Guest User';

  const renderContent = () => {
    const commonProps = { 
      isDark, 
      patientCount, 
      recentPatients, 
      loading, 
      setActiveTab,
      pageDescription: descriptions[activeTab] || descriptions.overview 
    };
    
    switch (activeTab) {
      case 'patients':
        return <PatientOverview isDark={isDark} setActiveTab={setActiveTab} pageDescription={descriptions.patients} />;
      case 'diabetes':
        return <DiabetesView isDark={isDark} setActiveTab={setActiveTab} pageDescription={descriptions.diabetes} />;
      case 'brain-tumor':
        return <BrainTumorView isDark={isDark} pageDescription={descriptions['brain-tumor']} />;
      case 'alzheimer':
        return <AlzheimerView isDark={isDark} pageDescription={descriptions.alzheimer} />;
      case 'breast-cancer':
        return <BreastCancerView isDark={isDark} pageDescription={descriptions['breast-cancer']} />;
      case 'covid':
        return <Covid19View isDark={isDark} pageDescription={descriptions.covid} />;
      case 'pneumonia':
        return <PneumoniaView isDark={isDark} pageDescription={descriptions.pneumonia} />;
      default:
        return <Overview isDark={isDark} currentUser={currentUser} {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'} transition-colors`}>      
      <div ref={sidebarRef}>
        <Sidebar
          isDark={isDark}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSidebar={toggleSidebar}
          onLogout={onLogout}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && isMobile && (
        <div 
          ref={backdropRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <Header
          isDark={isDark}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          pageTitle={titles[activeTab] || titles.overview}
          userInitials={getInitials()}
          userName={getFullName()}
        />

        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
        <Footer isDark={isDark} />
      </div>
    </div>
  );
};

export default Dashboard;