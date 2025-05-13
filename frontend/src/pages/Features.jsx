import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  ClipboardList, 
  Heart,
  Shield,
  Server
} from 'lucide-react';

const Features = ({ isDark }) => {
  const [activeFeature, setActiveFeature] = useState('auth');
  
  const features = [
    {
      id: 'auth',
      icon: <Shield className="text-2xl" />,
      title: 'Authentication & User Management',
      description: 'Secure login system with role-based access control for healthcare professionals.',
      link: '#models'
    },
    {
      id: 'patient',
      icon: <Users className="text-2xl" />,
      title: 'Patient Profile Management',
      description: 'Create, view, update, and archive patient profiles with comprehensive medical history tracking.',
      link: '#models'
    },
    {
      id: 'image',
      icon: <Activity className="text-2xl" />,
      title: 'Image-based Diagnostics',
      description: 'Upload and analyze medical images with AI models providing diagnostic insights.',
      link: '#models'
    },
    {
      id: 'tabular',
      icon: <ClipboardList className="text-2xl" />,
      title: 'Tabular Data Diagnostics',
      description: 'Input structured patient data for risk assessment and prediction models.',
      link: '#models'
    },
    {
      id: 'records',
      icon: <Heart className="text-2xl" />,
      title: 'Patient Health Records',
      description: 'Chronological view of diagnoses, results history, and medical notes.',
      link: '#models'
    },
    {
      id: 'api',
      icon: <Server className="text-2xl" />,
      title: 'Extensible API Architecture',
      description: 'Modular system designed for easy integration of new disease models.',
      link: '#models'
    }
  ];

  return (
    <div id="features" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row flex justify-center mb-16">
          <div className="col-12 col-sm-10 col-xl-7 col-xxl-6 text-center">
            <div className="section-title">
              <p className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">Top Features</p>
              <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
                Discover the core features of <span className="text-sky-500">HealthAI <i className="fi-rr-rocket-lunch"></i></span>
              </h2>
            </div>
          </div>
        </div>

        <div className="divider2 py-4"></div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="col"
                onMouseEnter={() => setActiveFeature(feature.id)}
              >
                <div className={`card service-card rounded-xl shadow-xl transition-all duration-300 h-full border ${
                  activeFeature === feature.id 
                  ? isDark 
                    ? 'bg-sky-900/40 border-sky-700 transform -translate-y-2' 
                    : 'bg-sky-50 border-sky-200 transform -translate-y-2' 
                  : isDark 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="card-body p-6">
                    <div className={`icons mb-4 rounded-full ${
                      activeFeature === feature.id
                      ? 'bg-sky-600'
                      : isDark ? 'bg-slate-700' : 'bg-slate-100'
                    } w-16 h-16 flex items-center justify-center transition-colors`}>
                      <span></span>
                      <div className={activeFeature === feature.id ? 'text-white' : isDark ? 'text-sky-400' : 'text-sky-600'}>
                        {feature.icon}
                      </div>
                    </div>
                    <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>{feature.title}</h4>
                    <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;