
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isDark }) => {
  return (
    <footer className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-6 py-4 transition-colors duration-300`}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          &copy; {new Date().getFullYear()} HealthAI. All rights reserved.
        </p>
        <div className="mt-2 sm:mt-0">
          <Link
            to="/"
            className={`text-sm ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-800'}`}
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;