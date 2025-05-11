import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Upload, AlertCircle, CheckCircle2, Image, Info, Brain } from 'lucide-react';

const AlzheimerView = ({ isDark }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [patientAge, setPatientAge] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock result - in a real app this would come from the API
      setResult({
        prediction: 'mild',
        probabilities: {
          normal: 0.15,
          mild: 0.72,
          moderate: 0.10,
          severe: 0.03,
        },
        heatmapUrl: 'https://via.placeholder.com/500x500.png?text=Alzheimer+Heatmap',
        regions: [
          { area: 'hippocampus', status: 'affected', severity: 'moderate' },
          { area: 'cerebral cortex', status: 'affected', severity: 'mild' },
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  // Helper function to get class for result severity
  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'normal':
        return isDark ? 'text-emerald-400' : 'text-emerald-600';
      case 'mild':
        return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'moderate':
        return isDark ? 'text-orange-400' : 'text-orange-600';
      case 'severe':
        return isDark ? 'text-rose-400' : 'text-rose-600';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Alzheimer's Disease Detection</h2>
        <Link
          to="/dashboard"
          className={`px-3 py-1 rounded-md ${
            isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
          } transition-colors text-sm flex items-center`}
        >
          <Home className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Info Panel */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-pink-500" />
            About This Tool
          </h3>
          
          <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            This tool uses deep learning to detect signs of Alzheimer's disease from MRI scans.
            The model can classify the severity into normal, mild, moderate, or severe categories.
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <h4 className="font-medium mb-2">Severity Classification:</h4>
            <ul className={`space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span>Normal: No signs of Alzheimer's</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span>Mild: Very mild cognitive decline</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Moderate: Mild cognitive decline</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                <span>Severe: Advanced cognitive decline</span>
              </li>
            </ul>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} mb-6`}>
            <h4 className="font-medium mb-2">Supported Files:</h4>
            <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>JPEG/JPG Images</li>
              <li>PNG Images</li>
              <li>DICOM Files (.dcm)</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
          
          <div className={`p-3 border ${
            isDark ? 'border-amber-700 bg-amber-900/20' : 'border-amber-200 bg-amber-50'
          } rounded-md`}>
            <p className={`text-sm flex items-start ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              This tool is for assistance only. All results should be reviewed by a qualified specialist.
            </p>
          </div>
        </div>

        {/* Upload & Results Area */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">MRI Scan Analysis</h3>
          
          {!selectedFile && (
            <div className={`border-2 border-dashed ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
            } rounded-lg p-8 text-center`}>
              <Image className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <h4 className="font-medium mb-2">Upload Brain MRI Scan</h4>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Upload a brain MRI scan image to analyze for signs of Alzheimer's disease
              </p>
              
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
                <input 
                  id="file-upload" 
                  type="file"
                  accept="image/*,.dcm" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {selectedFile && !result && !isLoading && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Selected Image</h4>
                <button 
                  onClick={resetAnalysis}
                  className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Cancel
                </button>
              </div>
              
              <div className="mb-4 flex justify-center">
                <div className={`border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-lg overflow-hidden max-w-md`}>
                  <img 
                    src={preview} 
                    alt="MRI Preview" 
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Patient Age (Optional)
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className={`w-full p-2 rounded-md ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'
                  } border`}
                  placeholder="Enter patient age"
                />
                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Age can help improve prediction accuracy
                </p>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleUpload}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze Image
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
              <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Analyzing brain MRI scan...
              </p>
            </div>
          )}

          {result && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Analysis Results</h4>
                <button 
                  onClick={resetAnalysis}
                  className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  New Analysis
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className={`border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-lg overflow-hidden`}>
                    <img 
                      src={preview} 
                      alt="Original MRI" 
                      className="w-full h-auto object-contain"
                    />
                    <div className={`p-2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} text-center text-sm`}>
                      Original Image
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className={`border ${isDark ? 'border-slate-700' : 'border-slate-200'} rounded-lg overflow-hidden`}>
                    <img 
                      src={result.heatmapUrl} 
                      alt="Analysis Visualization" 
                      className="w-full h-auto object-contain"
                    />
                    <div className={`p-2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} text-center text-sm`}>
                      Region Analysis
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 ${
                result.prediction === 'normal'
                  ? (isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200')
                  : (isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200')
              } border rounded-lg mb-6`}>
                <div className="flex items-center">
                  {result.prediction === 'normal' ? (
                    <CheckCircle2 className={`h-5 w-5 mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  ) : (
                    <AlertCircle className={`h-5 w-5 mr-2 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                  )}
                  
                  <h4 className="font-medium capitalize">
                    {result.prediction === 'normal' 
                      ? 'No Signs of Alzheimer\'s Detected' 
                      : `${result.prediction.charAt(0).toUpperCase() + result.prediction.slice(1)} Alzheimer's Signs Detected`}
                  </h4>
                </div>
              </div>
              
              <div className={`p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg mb-6`}>
                <h4 className="font-medium mb-3">Probability Distribution</h4>
                
                {Object.entries(result.probabilities).map(([category, probability]) => (
                  <div key={category} className="mb-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm capitalize ${getSeverityClass(category)}`}>
                        {category}
                      </span>
                      <span className="font-semibold text-sm">
                        {Math.round(probability * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${
                          category === 'normal' ? 'bg-emerald-500' :
                          category === 'mild' ? 'bg-amber-500' :
                          category === 'moderate' ? 'bg-orange-500' : 'bg-rose-500'
                        } h-2 rounded-full`}
                        style={{ width: `${probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {result.regions && result.regions.length > 0 && (
                <div className={`p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg mb-6`}>
                  <h4 className="font-medium mb-3">Affected Brain Regions</h4>
                  
                  <div className="space-y-2">
                    {result.regions.map((region, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                      >
                        <p className="capitalize font-medium">{region.area}</p>
                        <p className={`text-sm ${getSeverityClass(region.severity)} mt-1`}>
                          {region.status}: {region.severity} severity
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors flex-1 flex items-center justify-center">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save to Patient Records
                </button>
                
                <button className="px-4 py-2 border border-pink-600 text-pink-600 hover:bg-pink-50 rounded-md transition-colors flex-1 flex items-center justify-center">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlzheimerView;
