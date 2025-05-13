import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = ({ isDark }) => {
  return (
    <footer className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t px-6 py-4 transition-colors duration-300`}>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          &copy; {new Date().getFullYear()} HealthAI Admin Dashboard. All rights reserved.
        </p>
        <div className="mt-2 sm:mt-0">
          <Link
            to="/dashboard"
            className={`text-sm ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
          >
            Back to Main Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;