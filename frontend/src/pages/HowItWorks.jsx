import React from 'react';
import { 
  UserPlus, 
  FileSearch, 
  Brain,
  Database,
  BarChart,
  CheckCircle
} from 'lucide-react';

const HowItWorks = ({ isDark }) => {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8 text-white" />,
      title: 'Patient Selection',
      description: 'Select an existing patient or create a new profile to begin the diagnostic process.'
    },
    {
      icon: <FileSearch className="h-8 w-8 text-white" />,
      title: 'Data Input',
      description: 'Upload images or enter structured data depending on the selected diagnostic model.'
    },
    {
      icon: <Brain className="h-8 w-8 text-white" />,
      title: 'AI Analysis',
      description: 'Our advanced AI models process the provided data to generate comprehensive diagnostic insights.'
    }
  ];

  return (
    <div id="how-it-works" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
            HOW IT WORKS
          </div>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
            Just follow the simple 3 step & enjoy the new AI era
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Our intuitive workflow helps healthcare professionals quickly navigate from patient selection to final diagnosis.
          </p>
        </div>
        
        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative flex-1 p-8 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'} transition-transform duration-300 hover:-translate-y-2`}
            >
              {/* Connector lines for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-2 bg-sky-500 z-10"></div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {/* Circle with background */}
                  <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center mb-5">
                    {step.icon}
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {step.title}
                </h3>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-12`}>
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-md border`}>
            <Database className="h-10 w-10 text-sky-500 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Secure Data Storage</h3>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              All patient data and diagnostic results are securely stored with encryption and access controls.
            </p>
          </div>
          
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-md border`}>
            <BarChart className="h-10 w-10 text-sky-500 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Detailed Results</h3>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Receive comprehensive analysis with confidence scores, contributing factors, and visualizations.
            </p>
          </div>
          
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-lg shadow-md border`}>
            <CheckCircle className="h-10 w-10 text-sky-500 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Doctor's Confirmation</h3>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Review AI predictions and add your professional assessment to patient records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;