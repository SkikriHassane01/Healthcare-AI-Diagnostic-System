// frontend/src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useTheme } from '../context/ThemeContext';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import Features from './Features';
import AIModels from './AIModels';
import HowItWorks from './HowItWorks';
import Demo from './Demo';
import Testimonials from './Testimonials';
import Footer from './Footer';
import { ChevronUp } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  // Check if user is logged in and persist authentication
  const isLoggedIn = authService.isLoggedIn();
  
  // Use this function for navigation buttons
  const navigateToDashboard = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Ensure token is properly set before navigation
      authService.persistAuth();
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  const { isDark } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check if system prefers dark mode
  useEffect(() => {
    // Ensure auth is persisted on page load
    if (isLoggedIn) {
      authService.persistAuth();
    }
    
    // Listen for changes in system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // We don't set isDark here because that's now managed by ThemeContext
      // This just lets us react to system theme changes if needed
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isLoggedIn]);

  // Show/hide scroll to top button
  useEffect(() => {
    const toggleScrollButton = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', toggleScrollButton);
    return () => window.removeEventListener('scroll', toggleScrollButton);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
      <Navigation isDark={isDark} isLoggedIn={isLoggedIn} />
      <HeroSection isDark={isDark} isLoggedIn={isLoggedIn} navigateToDashboard={navigateToDashboard} />
      <Features isDark={isDark} />
      <AIModels isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <Demo isDark={isDark} />
      <Testimonials isDark={isDark} />
      <Footer isDark={isDark} />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 
            ${isDark ? 'bg-sky-600 hover:bg-sky-500' : 'bg-sky-500 hover:bg-sky-400'} 
            text-white transform hover:scale-110`}
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
      
      {/* Additional CSS for animations */}
      <style jsx="true">{`
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