import React, { useState } from 'react';
import { 
  Activity, 
  Brain, 
  Heart,
  AlertCircle,
  Bug,
  Microscope
} from 'lucide-react';

const AIModels = ({ isDark }) => {
  const [activeModel, setActiveModel] = useState('diabetes');

  const models = [
    {
      id: 'diabetes',
      icon: <Activity className="h-5 w-5 mr-2 text-emerald-500" />,
      name: 'Diabetes Model',
      type: 'Tabular data-based prediction',
      description: 'Analyzes patient health data to assess the risk of diabetes, allowing for early intervention and personalized care planning.',
      features: [
        'Blood glucose level analysis',
        'HbA1c evaluation',
        'BMI impact assessment',
        'Age and lifestyle risk analysis'
      ],
      accuracy: '94%',
      color: 'emerald',
      image: 'src/assets/images/diabetes.jpg'
    },
    {
      id: 'breastCancer',
      icon: <Heart className="h-5 w-5 mr-2 text-pink-500" />,
      name: 'Breast Cancer Model',
      type: 'Tabular data-based prediction',
      description: 'Analyzes Fine Needle Aspiration (FNA) test data to determine if a breast mass is benign or malignant with high accuracy.',
      features: [
        'Cell nucleus analysis',
        'Texture and perimeter evaluation',
        'Smoothness and compactness analysis',
        'Risk stratification'
      ],
      accuracy: '96%',
      color: 'pink',
      image: 'src/assets/images/breastcan.jpg'
    },
    {
      id: 'brainTumor',
      icon: <Brain className="h-5 w-5 mr-2 text-purple-500" />,
      name: 'Brain Tumor Model',
      type: 'Image-based diagnosis',
      description: 'Analyzes MRI scans to detect and localize potential brain tumors using advanced convolutional neural networks.',
      features: [
        'Tumor detection and localization',
        'Region-specific analysis',
        'Visual heatmap generation',
        'Confidence scoring'
      ],
      accuracy: '95%',
      color: 'purple',
      image: 'src/assets/images/brain_tumor.jpg'
    },
    {
      id: 'alzheimer',
      icon: <Brain className="h-5 w-5 mr-2 text-indigo-500" />,
      name: 'Alzheimer\'s Model',
      type: 'Image-based diagnosis',
      description: 'Evaluates brain scans to detect early signs of Alzheimer\'s disease and cognitive impairment stages.',
      features: [
        'Multi-stage classification',
        'Cognitive decline assessment',
        'Brain region analysis',
        'Progression tracking'
      ],
      accuracy: '92%',
      color: 'indigo',
      image: 'src/assets/images/alzheimer.jpg'
    },
    {
      id: 'covid',
      icon: <Bug className="h-5 w-5 mr-2 text-red-500" />,
      name: 'COVID-19 Model',
      type: 'Image-based diagnosis',
      description: 'Analyzes chest X-rays to identify COVID-19 related lung patterns and infection markers.',
      features: [
        'Ground-glass opacity detection',
        'Bilateral pulmonary involvement',
        'Severity assessment',
        'Infection pattern recognition'
      ],
      accuracy: '91%',
      color: 'red',
      image: 'src/assets/images/covid19.jpg'
    },
    {
      id: 'pneumonia',
      icon: <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />,
      name: 'Pneumonia Model',
      type: 'Image-based diagnosis',
      description: 'Identifies pneumonia patterns in chest X-rays with advanced image recognition to differentiate types and severity.',
      features: [
        'Lung infiltrate detection',
        'Bilateral vs. unilateral assessment',
        'Severity classification',
        'Pathogen type suggestions'
      ],
      accuracy: '93%',
      color: 'blue',
      image: 'src/assets/images/pneumonia.jpg'
    }
  ];

  const getActiveModel = () => {
    return models.find(model => model.id === activeModel);
  };

  const activeModelData = getActiveModel();

  return (
    <div id="models" className={`py-20 ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
            DIAGNOSTIC MODELS
          </div>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
            State-of-the-Art AI Diagnostic Models
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Our system integrates specialized AI models, each trained on thousands of clinical cases to deliver accurate diagnostic assistance.
          </p>
        </div>
        
        {/* Model Selection Tabs */}
        <div className="mb-10 flex justify-center flex-wrap">
          <div className={`inline-flex flex-wrap justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'} rounded-lg p-1 shadow-lg`}>
            {models.map((model) => (
              <button
                key={model.id}
                className={`px-4 py-2 m-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeModel === model.id
                    ? activeModel === 'diabetes' ? 'bg-emerald-600 text-white shadow-md' :
                      activeModel === 'breastCancer' ? 'bg-pink-600 text-white shadow-md' :
                      activeModel === 'brainTumor' ? 'bg-purple-600 text-white shadow-md' :
                      activeModel === 'alzheimer' ? 'bg-indigo-600 text-white shadow-md' :
                      activeModel === 'covid' ? 'bg-red-600 text-white shadow-md' :
                      'bg-blue-600 text-white shadow-md'
                    : `${isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'}`
                }`}
                onClick={() => setActiveModel(model.id)}
                aria-selected={activeModel === model.id}
              >
                {model.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Model Details */}
        <div 
          className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-xl p-6 border transition-opacity duration-150`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-4">
                MODEL METRICS
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>{activeModelData.name}</h3>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                {activeModelData.description}
              </p>
              <div className="space-y-4">
                {activeModelData.features.map((feature, index) => (
                  <div key={index} className="flex items-start transition-transform hover:translate-x-2 duration-200">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-6 rounded-lg shadow-lg border transform transition-all duration-300 hover:shadow-2xl animate-fade-in animation-delay-300`}>
              <img 
                src={activeModelData.image} 
                alt={`${activeModelData.name} Visualization`} 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Accuracy</p>
                  <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                      className={`${
                        activeModel === 'diabetes' ? 'bg-emerald-500' :
                        activeModel === 'breastCancer' ? 'bg-pink-500' :
                        activeModel === 'brainTumor' ? 'bg-purple-500' :
                        activeModel === 'alzheimer' ? 'bg-indigo-500' :
                        activeModel === 'covid' ? 'bg-red-500' :
                        'bg-blue-500'
                      } h-2.5 rounded-full animate-[grow_2s_ease-out]`} 
                      style={{ width: activeModelData.accuracy }}
                    ></div>
                  </div>
                  <p className={`text-right text-sm font-medium ${
                    activeModel === 'diabetes' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
                    activeModel === 'breastCancer' ? (isDark ? 'text-pink-400' : 'text-pink-600') :
                    activeModel === 'brainTumor' ? (isDark ? 'text-purple-400' : 'text-purple-600') :
                    activeModel === 'alzheimer' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') :
                    activeModel === 'covid' ? (isDark ? 'text-red-400' : 'text-red-600') :
                    (isDark ? 'text-blue-400' : 'text-blue-600')
                  } mt-1`}>
                    {activeModelData.accuracy}
                  </p>
                </div>
                <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-4 rounded-lg shadow transition-transform hover:scale-105 duration-200`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Type</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {activeModelData.type}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeModelData.type.includes('Image') 
                        ? (isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800')
                        : (isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800')
                    }`}>
                      {activeModelData.type.includes('Image') ? 'Image Processing' : 'Tabular Data'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModels;