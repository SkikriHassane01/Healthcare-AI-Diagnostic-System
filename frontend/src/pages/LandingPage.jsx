// frontend/src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Play } from 'lucide-react';

const LandingPage = () => {
  const isLoggedIn = authService.isLoggedIn();
  const [activeTab, setActiveTab] = useState('diabetes');
  const { isDark, setIsDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Handle scroll for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple toggle for theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Enhanced function to handle tab switching with smooth transition
  const handleTabChange = (tab) => {
    // First fade out current content
    document.getElementById('tab-content').classList.add('opacity-0');
    
    // After a short delay, change tab and fade in
    setTimeout(() => {
      setActiveTab(tab);
      document.getElementById('tab-content').classList.remove('opacity-0');
    }, 150);
  };

  // Handle video play
  const playVideo = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      video.play();
      setIsVideoPlaying(true);
    }
  };
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-sky-600'} transition-colors`}>HealthAI Diagnostics</span>
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="#features" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Features</a>
                <a href="#models" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>AI Models</a>
                <a href="#workflow" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Workflow</a>
                <a href="#demo" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Demo</a>
              </div>
            </div>
            <div className="flex items-center">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg mr-4 transition-colors ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-sky-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
              
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-md"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? 'text-white hover:text-sky-400' : 'text-slate-700 hover:text-sky-600'} transition-colors`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className={`relative ${isDark ? 'bg-slate-900' : 'bg-slate-50'} pt-24 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fade-in">
            <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Transforming Medical <span className="text-sky-500">Diagnostics</span> With AI
            </h1>
            <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mb-8`}>
              Our advanced AI-powered system helps healthcare professionals diagnose patients with unprecedented speed and accuracy, reducing diagnostic errors by up to 47%.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={isLoggedIn ? "/dashboard" : "/register"}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-sky-600 hover:bg-sky-500 transition-colors transform hover:scale-105 duration-200"
              >
                Get Started Now
              </Link>
              <a
                href="#demo"
                className={`flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md shadow-md transition-colors transform hover:scale-105 duration-200 ${
                  isDark ? 'border-sky-500 text-white hover:bg-sky-900/30' : 'border-sky-600 text-sky-600 hover:bg-sky-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </a>
            </div>
          </div>
          <div className="md:w-1/2 animate-fade-in animation-delay-300">
            <div className={`relative p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl border transform hover:-translate-y-1 transition-transform duration-300`}>
              <img 
                src="src/assets/images/about.jpg" 
                alt="AI Diagnostics Platform" 
                className="rounded-lg shadow-lg w-full"
              />
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 h-16 w-16 bg-sky-500/20 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-sky-600/20 rounded-full blur-xl animate-pulse-slow animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} py-12 border-y transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>47%</p>
              <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Faster Diagnosis</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>93%</p>
              <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Accuracy Rate</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>2500+</p>
              <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Patients Diagnosed</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>6</p>
              <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>AI Models</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
              FEATURES
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
              Comprehensive Tools for Healthcare Professionals
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Our platform provides powerful features designed specifically for medical practitioners to streamline the diagnostic process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border`}>
              <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>Advanced Patient Management</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Efficiently organize patient profiles with comprehensive medical histories, diagnostic records, and treatment plans.
              </p>
              <ul className={`${isDark ? 'text-slate-400' : 'text-slate-500'} space-y-2`}>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure medical record storage
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Timeline visualization of patient history
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced search and filtering
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border`}>
              <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>AI-Powered Diagnostics</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Leverage state-of-the-art machine learning models to assist with diagnosis of multiple medical conditions with high accuracy.
              </p>
              <ul className={`${isDark ? 'text-slate-400' : 'text-slate-500'} space-y-2`}>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  93% diagnostic accuracy rate
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time prediction feedback
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multiple condition support
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border`}>
              <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>Comprehensive Reporting</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                Generate detailed diagnostic reports with advanced visualizations and confidence scores for better clinical decision-making.
              </p>
              <ul className={`${isDark ? 'text-slate-400' : 'text-slate-500'} space-y-2`}>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exportable PDF and DICOM formats
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Interactive data visualizations
                </li>
                <li className="flex items-start">
                  <svg className={`h-5 w-5 mr-2 ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Automated follow-up recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Diagnostic Models Section */}
      <div id="models" className={`py-20 ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
              DIAGNOSTIC MODELS
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
              State-of-the-Art AI Diagnostic Models
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Our system integrates specialized AI models, each trained on thousands of clinical cases to deliver accurate diagnostic assistance.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="mb-10 flex justify-center">
            <div className={`inline-flex ${isDark ? 'bg-slate-900' : 'bg-slate-100'} rounded-lg p-1 shadow-lg`}>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'diabetes' 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : `${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'}`
                }`}
                onClick={() => handleTabChange('diabetes')}
                aria-selected={activeTab === 'diabetes'}
              >
                Diabetes
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'brainTumor' 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : `${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'}`
                }`}
                onClick={() => handleTabChange('brainTumor')}
                aria-selected={activeTab === 'brainTumor'}
              >
                Brain Tumor
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'future' 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : `${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'}`
                }`}
                onClick={() => handleTabChange('future')}
                aria-selected={activeTab === 'future'}
              >
                Future Models
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div 
            id="tab-content"
            className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl p-6 border transition-opacity duration-150`}
          >
            {activeTab === 'diabetes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="animate-fade-in">
                  <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-4">
                    MODEL METRICS
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>Diabetes Prediction Model</h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                    Our AI diabetes model analyzes patient history and biomarkers to predict diabetes risk with high accuracy, helping healthcare providers intervene earlier.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Patient History Analysis</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Comprehensive evaluation of family history, lifestyle factors, and previous health conditions.</p>
                      </div>
                    </div>
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Biomarker Evaluation</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Analysis of glucose levels, HbA1c, insulin resistance markers, and other critical indicators.</p>
                      </div>
                    </div>
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Personalized Risk Profile</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Generation of individualized risk assessments and preventive care recommendations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-6 rounded-lg shadow-lg border transform transition-all duration-300 hover:shadow-2xl animate-fade-in animation-delay-300`}>
                  <img 
                    src="src/assets/images/diabetes.jpg" 
                    alt="Diabetes Prediction Model" 
                    className="rounded-lg shadow-lg w-full"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Accuracy</p>
                      <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full animate-[grow_2s_ease-out]" style={{ width: '94%' }}></div>
                      </div>
                      <p className={`text-right text-sm font-medium ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-1`}>94%</p>
                    </div>
                    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Recall</p>
                      <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full animate-[grow_2.3s_ease-out]" style={{ width: '91%' }}></div>
                      </div>
                      <p className={`text-right text-sm font-medium ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-1`}>91%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'brainTumor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-4">
                    MODEL METRICS
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>Brain Tumor Detection Model</h3>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                    Our advanced neural network analyzes MRI scans to identify potential brain tumors with precise region identification and classification.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Advanced MRI Analysis</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Multi-sequence MRI processing with 3D spatial recognition for comprehensive evaluation.</p>
                      </div>
                    </div>
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Visual Heatmap Generation</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Color-coded visualization highlighting areas of concern with probability distribution.</p>
                      </div>
                    </div>
                    <div className="flex items-start transition-transform hover:translate-x-2 duration-200">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Tumor Classification</h4>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Identification of tumor type and grade with detailed comparative analysis.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-6 rounded-lg shadow-lg border animate-fade-in animation-delay-300 transform transition-all duration-300 hover:shadow-2xl`}>
                  <img 
                    src="src/assets/images/brain_tumor.jpg" 
                    alt="Brain Tumor Detection Model" 
                    className="rounded-lg shadow-lg w-full"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Accuracy</p>
                      <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full animate-[grow_2s_ease-out]" style={{ width: '96%' }}></div>
                      </div>
                      <p className={`text-right text-sm font-medium ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-1`}>96%</p>
                    </div>
                    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Recall</p>
                      <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full animate-[grow_2.3s_ease-out]" style={{ width: '93%' }}></div>
                      </div>
                      <p className={`text-right text-sm font-medium ${isDark ? 'text-sky-400' : 'text-sky-600'} mt-1`}>93%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'future' && (
              <div className="animate-fade-in">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6 text-center`}>Coming Soon: Expanding Our Diagnostic Capabilities</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-8 text-center max-w-3xl mx-auto`}>
                  Our team is actively developing new AI models to expand our diagnostic capabilities across more medical conditions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-transform hover:-translate-y-2 duration-300`}>
                    <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-2`}>Alzheimer's Detection</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Early-stage detection and progression monitoring through advanced imaging analysis.</p>
                    <div className="mt-4 flex items-center">
                      <div className={`text-xs ${isDark ? 'text-sky-400' : 'text-sky-600'} font-medium`}>In Development</div>
                      <div className="ml-2 bg-slate-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-transform hover:-translate-y-2 duration-300`}>
                    <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-2`}>Covid-19 Analysis</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Chest X-ray and CT scan evaluation for COVID-19 detection and severity assessment.</p>
                    <div className="mt-4 flex items-center">
                      <div className={`text-xs ${isDark ? 'text-sky-400' : 'text-sky-600'} font-medium`}>In Development</div>
                      <div className="ml-2 bg-slate-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-transform hover:-translate-y-2 duration-300`}>
                    <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-2`}>Pneumonia Detection</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Lung inflammation analysis with pathogen type classification and severity scoring.</p>
                    <div className="mt-4 flex items-center">
                      <div className={`text-xs ${isDark ? 'text-sky-400' : 'text-sky-600'} font-medium`}>In Development</div>
                      <div className="ml-2 bg-slate-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-transform hover:-translate-y-2 duration-300`}>
                    <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-2`}>Breast Cancer Screening</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Mammogram analysis with early-stage cancer detection and classification.</p>
                    <div className="mt-4 flex items-center">
                      <div className={`text-xs ${isDark ? 'text-sky-400' : 'text-sky-600'} font-medium`}>In Development</div>
                      <div className="ml-2 bg-slate-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* How It Works Section - Simplified for brevity */}
      <div id="workflow" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
              WORKFLOW
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
              Streamlined Diagnostic Process
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Our intuitive workflow helps healthcare professionals quickly navigate from patient selection to final diagnosis.
            </p>
          </div>
          
          {/* Workflow steps - simplified with animations */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <div className="rounded-full bg-sky-600 text-white w-8 h-8 flex items-center justify-center mb-4 font-bold">1</div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>Patient Selection</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Select an existing patient or create a new profile to begin the diagnostic process.
                </p>
              </div>
              
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <div className="rounded-full bg-sky-600 text-white w-8 h-8 flex items-center justify-center mb-4 font-bold">2</div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>AI Analysis</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Our advanced AI models process the provided data to generate comprehensive diagnostic insights.
                </p>
              </div>
              
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <div className="rounded-full bg-sky-600 text-white w-8 h-8 flex items-center justify-center mb-4 font-bold">3</div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>Review Results</h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Examine detailed results with confidence scores and visual indicators to support clinical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Section - Simplified */}
      <div id="demo" className={`py-20 ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 w-full">
              {/* Enhanced video container with better play button */}
              <div className={`rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-1 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
                <div className={`${isDark ? 'bg-slate-900' : 'bg-slate-50'} rounded-lg overflow-hidden relative`}>
                  {/* Video header */}
                  <div className="bg-slate-800 p-2 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="ml-3 text-sm text-slate-400">Healthcare AI Diagnostic Dashboard</div>
                  </div>
                  
                  {/* Video component with loading indicator */}
                  <div className="relative aspect-video bg-slate-900">
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-slate-400 border-t-sky-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    <video 
                      id="demo-video"
                      className="w-full h-full object-cover"
                      poster="https://placehold.co/800x500/1e293b/38bdf8?text=System+Demo+Video"
                      onLoadStart={() => setIsVideoLoading(true)}
                      onLoadedData={() => setIsVideoLoading(false)}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                      onEnded={() => setIsVideoPlaying(false)}
                      controls={isVideoPlaying}
                    >
                      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Improved play button - only show when not playing */}
                    {!isVideoPlaying && (
                      <button 
                        onClick={playVideo}
                        className="absolute inset-0 flex items-center justify-center w-full h-full group focus:outline-none"
                        aria-label="Play video"
                      >
                        <span className={`
                          flex items-center justify-center rounded-full
                          bg-sky-600/90 text-white
                          w-20 h-20
                          shadow-lg shadow-sky-900/50
                          transition-all duration-300 ease-in-out
                          group-hover:bg-sky-500 group-hover:scale-110
                          group-focus:ring-4 group-focus:ring-sky-500/50
                        `}>
                          <Play className="w-10 h-10 ml-1" />
                        </span>
                        <span className="absolute inset-0 bg-slate-900/30 rounded-lg transition-opacity group-hover:opacity-0"></span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full mt-8 md:mt-0">
              <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-4">
                SYSTEM DEMONSTRATION
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
                See the Healthcare AI Diagnostic System in Action
              </h2>
              <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-8`}>
                Watch our demonstration video to see how our platform streamlines the diagnostic process.
              </p>
              <div className="space-y-4">
                <div className="flex items-start transform transition hover:translate-x-2 duration-200">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Complete Workflow Demonstration</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>See the entire diagnostic process from start to finish.</p>
                  </div>
                </div>
                <div className="flex items-start transform transition hover:translate-x-2 duration-200">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>User Interface Tour</h4>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Overview of the intuitive dashboard and reporting features.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 bg-sky-600 dark:bg-sky-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-8 md:mb-0 md:max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to transform your diagnostic capabilities?
            </h2>
            <p className="text-white text-lg">
              Join thousands of healthcare professionals using our AI-powered diagnostic platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
          <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-sky-600 hover:bg-sky-500 transition-colors transform hover:scale-105 duration-200">
              Get Started Now
          </Link>
          </div>
        </div>
      </div>
      
      {/* Footer - Simplified */}
      <footer className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-800 border-slate-700'} py-12 border-t transition-colors duration-300 text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#features" className="hover:text-sky-400 transition-colors">Features</a></li>
                <li><a href="#models" className="hover:text-sky-400 transition-colors">AI Models</a></li>
                <li><a href="#workflow" className="hover:text-sky-400 transition-colors">Workflow</a></li>
                <li><a href="#demo" className="hover:text-sky-400 transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 md:col-start-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Sales</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Partnerships</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-white">HealthAI Diagnostics</span>
              <p className="mt-2 text-sm text-slate-400">
                Advanced AI diagnostic tools for healthcare professionals.
              </p>
            </div>
            <div className="text-center text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Healthcare AI Diagnostic System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes grow {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* More responsive design CSS for small screens */
        @media (max-width: 640px) {
          .animate-fade-in {
            animation-duration: 0.5s;
          }
          
          .max-w-2xl {
            max-width: 100%;
          }
          
          h1 {
            font-size: 2.5rem;
          }
          
          h2 {
            font-size: 2rem;
          }
          
          .py-20 {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;