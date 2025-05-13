import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Github 
} from 'lucide-react';

const Footer = ({ isDark }) => {
  return (
    <footer className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 border-slate-700'} border-t`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">HealthAI</h3>
            <p className="text-slate-300 mb-4">
              Advanced AI-powered diagnostic tools for healthcare professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#models" className="hover:text-sky-400 transition-colors">AI Models</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#demo" className="hover:text-sky-400 transition-colors">Demo</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">API Reference</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-sky-400" />
                <a href="mailto:info@healthai.com" className="hover:text-sky-400 transition-colors">
                  info@healthai.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-sky-400" />
                <a href="tel:+1234567890" className="hover:text-sky-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Sales</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} HealthAI Diagnostics. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-2">Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span className="text-sm text-slate-400">by Healthcare AI Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;