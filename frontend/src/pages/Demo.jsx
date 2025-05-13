import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';

const Demo = ({ isDark }) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Patient Selection Interface",
      description: "The dashboard provides quick access to patient profiles. Create a new patient or select an existing one to begin the diagnostic process.",
      imageUrl: "src/assets/steps/step1.png"
    },
    {
      title: "Choosing the Diagnostic Tool",
      description: "Select from six specialized AI models based on your diagnostic needs, whether analyzing medical images or tabular patient data.",
      imageUrl: "src/assets/steps/step2.png"
    },
    {
      title: "Reviewing Results",
      description: "Review comprehensive diagnostic insights with confidence scores, risk factors, and visualizations to support clinical decision-making.",
      imageUrl: "src/assets/steps/step3.png"
    }
  ];

  // Handle video play
  const playVideo = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      video.play();
      setIsVideoPlaying(true);
    }
  };

  // Navigate through steps
  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div id="demo" className={`py-20 ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-sm font-semibold mb-2">
            SYSTEM DEMONSTRATION
          </div>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
            See the Healthcare AI Diagnostic System in Action
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-8`}>
            Watch our demonstration video to see how our platform streamlines the diagnostic process.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Video Demo Section */}
          <div className="md:w-1/2 w-full">
            <div className={`rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-1 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
              <div className={`${isDark ? 'bg-slate-900' : 'bg-slate-50'} rounded-lg overflow-hidden relative`}>
                {/* Video header */}
                <div className="bg-slate-800 p-2 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="ml-3 text-sm text-slate-400">Healthcare AI Diagnostic Dashboard</div>
                </div>
                
                {/* Video component with loading indicator */}
                <div className="relative aspect-video bg-slate-900">
                  {isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-slate-400 border-t-sky-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <video 
                    id="demo-video"
                    className="w-full h-full object-cover"
                    poster="https://placehold.co/800x500/1e293b/38bdf8?text=System+Demo+Video"
                    onLoadStart={() => setIsVideoLoading(true)}
                    onLoadedData={() => setIsVideoLoading(false)}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                    controls={isVideoPlaying}
                  >
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Improved play button - only show when not playing */}
                  {!isVideoPlaying && (
                    <button 
                      onClick={playVideo}
                      className="absolute inset-0 flex items-center justify-center w-full h-full group focus:outline-none"
                      aria-label="Play video"
                    >
                      <span className={`
                        flex items-center justify-center rounded-full
                        bg-sky-600/90 text-white
                        w-20 h-20
                        shadow-lg shadow-sky-900/50
                        transition-all duration-300 ease-in-out
                        group-hover:bg-sky-500 group-hover:scale-110
                        group-focus:ring-4 group-focus:ring-sky-500/50
                      `}>
                        <Play className="w-10 h-10 ml-1" />
                      </span>
                      <span className="absolute inset-0 bg-slate-900/30 rounded-lg transition-opacity group-hover:opacity-0"></span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Steps Section */}
          <div className="md:w-1/2 w-full mt-8 md:mt-0">
            <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg border p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {demoSteps[currentStep].title}
                </h3>
                <div className="text-sm text-slate-400">
                  Step {currentStep + 1} of {demoSteps.length}
                </div>
              </div>
              
              <div className="mb-6">
                <img 
                  src={demoSteps[currentStep].imageUrl || "src/assets/steps/step1.png"} 
                  alt={`Demo step ${currentStep + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {demoSteps[currentStep].description}
              </p>
              
              <div className="flex justify-between">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 flex items-center rounded-md ${
                    currentStep === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : isDark 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  } transition-colors`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <button 
                  onClick={nextStep}
                  disabled={currentStep === demoSteps.length - 1}
                  className={`px-4 py-2 flex items-center rounded-md ${
                    currentStep === demoSteps.length - 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  } transition-colors`}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <a 
                href="#features" 
                className={`inline-block px-6 py-3 rounded-md ${isDark ? 'bg-sky-700 hover:bg-sky-600' : 'bg-sky-600 hover:bg-sky-500'} text-white font-medium transition-colors`}
              >
                Explore Key Features
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;