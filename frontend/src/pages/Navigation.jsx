import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Navigation = ({ isDark, setIsDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen 
        ? (isDark ? 'bg-slate-800 shadow-lg' : 'bg-white shadow-lg') 
        : (isDark ? 'bg-transparent' : 'bg-transparent')
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-sky-600'} transition-colors`}>
                HealthAI
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <a href="#features" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Features</a>
              <a href="#models" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>AI Models</a>
              <a href="#how-it-works" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>How It Works</a>
              <a href="#demo" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Demo</a>
              <a href="#testimonials" className={`${isDark ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'} transition-colors`}>Testimonials</a>
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

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>Features</a>
            <a href="#models" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>AI Models</a>
            <a href="#how-it-works" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>How It Works</a>
            <a href="#demo" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>Demo</a>
            <a href="#testimonials" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>Testimonials</a>
            <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Link
                    to="/register"
                    className="w-full px-4 py-2 text-center rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;