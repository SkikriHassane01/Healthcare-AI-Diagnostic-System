import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ isDark, isLoggedIn, navigateToDashboard }) => {
  return (
    <div className={`relative ${isDark ? 'bg-slate-900' : 'bg-slate-50'} pt-24 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fade-in">
          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Transforming Medical <span className="text-sky-500">Diagnostics</span> With AI
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-700'} max-w-3xl mb-8`}>
            Our advanced AI-powered system helps healthcare professionals diagnose patients with unprecedented speed and accuracy, reducing diagnostic errors.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-sky-600 hover:bg-sky-500 transition-colors transform hover:scale-105 duration-200"
              onClick={navigateToDashboard}
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
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
          {/* Image container with proper styling */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="src/assets/images/about.jpg"
              alt="AI Diagnostics Platform" 
              className="w-full h-auto object-cover"
            />
            {/* Optional overlay effects for better integration */}
            {isDark && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>}
            
            {/* Optional floating decorative elements */}
            <div className="absolute -top-4 -right-4 h-16 w-16 bg-sky-500/20 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-sky-600/20 rounded-full blur-xl animate-pulse-slow animation-delay-2000"></div>
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
    </div>
  );
};

export default HeroSection;