// frontend/src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/layout/ThemeToggle';

const LandingPage = () => {
  const isLoggedIn = authService.isLoggedIn();
  const [activeTab, setActiveTab] = useState('diabetes');
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#020712] text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-[#111827]' : 'bg-gray-50'} shadow-lg fixed w-full z-10 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>HealthAI Diagnostics</span>
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Features</a>
                <a href="#models" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>AI Models</a>
                <a href="#workflow" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Workflow</a>
                <a href="#demo" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Demo</a>
              </div>
            </div>
            <div className="flex items-center">
              {/* Add Theme Toggle Button */}
              <div className="mr-4">
                <ThemeToggle />
              </div>
              
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded text-sm font-medium ${isDark ? 'text-white hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section - Simplified */}
      <div className={`relative ${isDark ? 'bg-[#020712]' : 'bg-white'} pt-24 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Transforming Medical <span className="text-blue-400">Diagnostics</span> With AI
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mb-8">
              Our advanced AI-powered system helps healthcare professionals diagnose patients with unprecedented speed and accuracy, reducing diagnostic errors by up to 47%.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={isLoggedIn ? "/dashboard" : "/register"}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Get Started Now
              </Link>
              <a
                href="#demo"
                className="flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md shadow-lg text-white hover:bg-blue-600 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative p-4 bg-[#111827] rounded-lg shadow-xl border border-blue-900/30">
              <img 
                src="https://placehold.co/800x500/111827/e5e7eb?text=AI+Healthcare+Diagnostics" 
                alt="AI Diagnostics Platform" 
                className="rounded shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className={`${isDark ? 'bg-[#111827] border-blue-900/30' : 'bg-gray-100 border-gray-200'} py-12 border-y transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>47%</p>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Faster Diagnosis</p>
            </div>
            <div className="text-center">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>93%</p>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy Rate</p>
            </div>
            <div className="text-center">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>2500+</p>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Patients Diagnosed</p>
            </div>
            <div className="text-center">
              <p className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>6</p>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>AI Models</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className={`py-20 ${isDark ? 'bg-[#020712]' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-2">
              FEATURES
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>
              Comprehensive Tools for Healthcare Professionals
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Our platform provides powerful features designed specifically for medical practitioners to streamline the diagnostic process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className={`bg-[#111827] rounded-lg shadow-xl p-6 transition-transform hover:translate-y-[-5px] border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>Advanced Patient Management</h3>
              <p className={`text-gray-300 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Efficiently organize patient profiles with comprehensive medical histories, diagnostic records, and treatment plans.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure medical record storage
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Timeline visualization of patient history
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced search and filtering
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className={`bg-[#111827] rounded-lg shadow-xl p-6 transition-transform hover:translate-y-[-5px] border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>AI-Powered Diagnostics</h3>
              <p className={`text-gray-300 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Leverage state-of-the-art machine learning models to assist with diagnosis of multiple medical conditions with high accuracy.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  93% diagnostic accuracy rate
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time prediction feedback
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multiple condition support
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className={`bg-[#111827] rounded-lg shadow-xl p-6 transition-transform hover:translate-y-[-5px] border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>Comprehensive Reporting</h3>
              <p className={`text-gray-300 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Generate detailed diagnostic reports with advanced visualizations and confidence scores for better clinical decision-making.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exportable PDF and DICOM formats
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Interactive data visualizations
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
      <div id="models" className={`py-20 ${isDark ? 'bg-[#111827]' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-2">
              DIAGNOSTIC MODELS
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>
              State-of-the-Art AI Diagnostic Models
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Our system integrates specialized AI models, each trained on thousands of clinical cases to deliver accurate diagnostic assistance.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="mb-10 flex justify-center">
            <div className={`inline-flex ${isDark ? 'bg-[#020712]' : 'bg-gray-50'} rounded-lg p-1 shadow-lg`}>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'diabetes' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                } transition-all`}
                onClick={() => setActiveTab('diabetes')}
              >
                Diabetes
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'brainTumor' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                } transition-all`}
                onClick={() => setActiveTab('brainTumor')}
              >
                Brain Tumor
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'future' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`
                } transition-all`}
                onClick={() => setActiveTab('future')}
              >
                Future Models
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className={`bg-[#020712] rounded-lg shadow-2xl p-6 border ${isDark ? 'border-blue-900/30' : 'border-gray-200'} transition-colors duration-300`}>
            {activeTab === 'diabetes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-4">
                    MODEL METRICS
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Diabetes Prediction Model</h3>
                  <p className={`text-gray-300 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Our AI diabetes model analyzes patient history and biomarkers to predict diabetes risk with high accuracy, helping healthcare providers intervene earlier.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Patient History Analysis</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Comprehensive evaluation of family history, lifestyle factors, and previous health conditions.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Biomarker Evaluation</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Analysis of glucose levels, HbA1c, insulin resistance markers, and other critical indicators.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Personalized Risk Profile</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Generation of individualized risk assessments and preventive care recommendations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] p-6 rounded-lg shadow-inner border border-blue-900/20">
                  <img 
                    src="https://placehold.co/600x400/111827/3b82f6?text=Diabetes+Prediction+Model" 
                    alt="Diabetes Prediction Model" 
                    className="rounded-lg shadow-lg w-full"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-[#020712] p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Accuracy</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                      <p className="text-right text-sm font-medium text-blue-400 mt-1">94%</p>
                    </div>
                    <div className="bg-[#020712] p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Recall</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                      <p className="text-right text-sm font-medium text-blue-400 mt-1">91%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'brainTumor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-4">
                    MODEL METRICS
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Brain Tumor Detection Model</h3>
                  <p className={`text-gray-300 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Our advanced neural network analyzes MRI scans to identify potential brain tumors with precise region identification and classification.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Advanced MRI Analysis</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Multi-sequence MRI processing with 3D spatial recognition for comprehensive evaluation.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Visual Heatmap Generation</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Color-coded visualization highlighting areas of concern with probability distribution.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Tumor Classification</h4>
                        <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Identification of tumor type and grade with detailed comparative analysis.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] p-6 rounded-lg shadow-inner border border-blue-900/20">
                  <img 
                    src="https://placehold.co/600x400/111827/3b82f6?text=Brain+Tumor+Detection" 
                    alt="Brain Tumor Detection Model" 
                    className="rounded-lg shadow-lg w-full"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-[#020712] p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Accuracy</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <p className="text-right text-sm font-medium text-blue-400 mt-1">96%</p>
                    </div>
                    <div className="bg-[#020712] p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Recall</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '93%' }}></div>
                      </div>
                      <p className="text-right text-sm font-medium text-blue-400 mt-1">93%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'future' && (
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6 text-center`}>Coming Soon: Expanding Our Diagnostic Capabilities</h3>
                <p className={`text-gray-300 mb-8 text-center max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Our team is actively developing new AI models to expand our diagnostic capabilities across more medical conditions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>Alzheimer's Detection</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Early-stage detection and progression monitoring through advanced imaging analysis.</p>
                    <div className="mt-4 flex items-center">
                      <div className="text-xs text-blue-400 font-medium">In Development</div>
                      <div className="ml-2 bg-gray-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>Covid-19 Analysis</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Chest X-ray and CT scan evaluation for COVID-19 detection and severity assessment.</p>
                    <div className="mt-4 flex items-center">
                      <div className="text-xs text-blue-400 font-medium">In Development</div>
                      <div className="ml-2 bg-gray-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>Pneumonia Detection</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Lung inflammation analysis with pathogen type classification and severity scoring.</p>
                    <div className="mt-4 flex items-center">
                      <div className="text-xs text-blue-400 font-medium">In Development</div>
                      <div className="ml-2 bg-gray-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>Breast Cancer Screening</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Mammogram analysis with early-stage cancer detection and classification.</p>
                    <div className="mt-4 flex items-center">
                      <div className="text-xs text-blue-400 font-medium">In Development</div>
                      <div className="ml-2 bg-gray-700 h-1.5 w-24 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div id="workflow" className={`py-20 ${isDark ? 'bg-[#020712]' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-2">
              WORKFLOW
            </div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>
              Streamlined Diagnostic Process
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Our intuitive workflow helps healthcare professionals quickly navigate from patient selection to final diagnosis.
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-900/30 hidden md:block"></div>
            
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>1. Patient Selection & Data Entry</h3>
                      <p className={`text-gray-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Select an existing patient or create a new profile. Input relevant clinical data or upload medical images based on the diagnostic need.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg z-10 hidden md:flex">
                    1
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className={`bg-[#111827] p-4 rounded-lg border ${isDark ? 'border-blue-900/10' : 'border-gray-200'}`}>
                      <img 
                        src="https://placehold.co/400x200/111827/3b82f6?text=Patient+Selection" 
                        alt="Patient Selection" 
                        className="rounded-lg shadow w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-last md:order-first">
                    <div className={`bg-[#111827] p-4 rounded-lg border ${isDark ? 'border-blue-900/10' : 'border-gray-200'}`}>
                      <img 
                        src="https://placehold.co/400x200/111827/3b82f6?text=AI+Analysis" 
                        alt="AI Analysis" 
                        className="rounded-lg shadow w-full"
                      />
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg z-10 hidden md:flex">
                    2
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-first md:order-last">
                    <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>2. AI Analysis</h3>
                      <p className={`text-gray-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Our advanced AI models process the provided data, analyzing patterns and indicators to generate comprehensive diagnostic insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>3. Review Results</h3>
                      <p className={`text-gray-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Examine detailed diagnostic results with confidence scores, contributing factors, and visual indicators to support your clinical decision-making.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg z-10 hidden md:flex">
                    3
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className={`bg-[#111827] p-4 rounded-lg border ${isDark ? 'border-blue-900/10' : 'border-gray-200'}`}>
                      <img 
                        src="https://placehold.co/400x200/111827/3b82f6?text=Review+Results" 
                        alt="Review Results" 
                        className="rounded-lg shadow w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-last md:order-first">
                    <div className={`bg-[#111827] p-4 rounded-lg border ${isDark ? 'border-blue-900/10' : 'border-gray-200'}`}>
                      <img 
                        src="https://placehold.co/400x200/111827/3b82f6?text=Save+and+Export" 
                        alt="Save and Export" 
                        className="rounded-lg shadow w-full"
                      />
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg z-10 hidden md:flex">
                    4
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-first md:order-last">
                    <div className={`bg-[#111827] p-6 rounded-lg shadow-lg border ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>4. Save & Export</h3>
                      <p className={`text-gray-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Save the results to the patient's profile for future reference, export detailed reports in multiple formats, or share findings with colleagues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Section */}
      <div id="demo" className={`py-20 ${isDark ? 'bg-[#111827]' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="rounded-lg bg-[#020712] p-1 shadow-2xl">
                <div className="bg-[#020712] rounded-lg overflow-hidden relative">
                  <div className="bg-[#111827] p-2 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-3 text-sm text-gray-400">Healthcare AI Diagnostic Dashboard</div>
                  </div>
                  <video 
                    className="w-full" 
                    controls
                    poster="https://placehold.co/800x500/020712/3b82f6?text=System+Demo+Video"
                  >
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a href="#demo" className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-4">
                SYSTEM DEMONSTRATION
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>
                See the Healthcare AI Diagnostic System in Action
              </h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
                Watch our demonstration video to see how our platform streamlines the diagnostic process.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Complete Workflow Demonstration</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>See the entire diagnostic process from start to finish.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>User Interface Tour</h4>
                    <p className={`text-gray-400 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Overview of the intuitive dashboard and reporting features.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 bg-blue-600">
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
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-md shadow-lg hover:bg-gray-100 transition-colors text-center"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-700 text-white font-medium rounded-md shadow-lg border border-blue-500 hover:bg-blue-800 transition-colors text-center"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer - Simplified */}
      <footer className={`bg-[#020712] py-12 border-t ${isDark ? 'border-blue-900/30' : 'border-gray-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Features</a></li>
                <li><a href="#models" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>AI Models</a></li>
                <li><a href="#workflow" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Workflow</a></li>
                <li><a href="#demo" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Documentation</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>User Guide</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>API Reference</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 md:col-start-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Support</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Sales</a></li>
                <li><a href="#" className={`${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Partnerships</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-blue-900/30 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>HealthAI Diagnostics</span>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Advanced AI diagnostic tools for healthcare professionals.
              </p>
            </div>
            <div className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Healthcare AI Diagnostic System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;