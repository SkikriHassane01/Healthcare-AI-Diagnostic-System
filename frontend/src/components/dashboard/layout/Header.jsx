import React from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../../layout/ThemeToggle';

const Header = ({ 
  isDark, 
  isSidebarOpen, 
  toggleSidebar, 
  pageTitle, 
  userInitials,
  userName 
}) => {
  return (
    <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm sticky top-0 z-10 transition-colors duration-300`}>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className={`${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-sky-600'} p-2 rounded-md transition-colors mr-2`}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-semibold">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center mr-2">
              <span className="font-medium text-sm">{userInitials}</span>
            </div>
            <span className="hidden md:block text-sm font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
