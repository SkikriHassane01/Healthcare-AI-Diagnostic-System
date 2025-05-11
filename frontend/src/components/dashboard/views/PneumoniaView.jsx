import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Upload, AlertCircle, CheckCircle2, Image, Info, Stethoscope } from 'lucide-react'; // Changed Lungs to Stethoscope

const PneumoniaView = ({ isDark }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsLoading(true);
    // simulate API
    setTimeout(() => {
      setResult({
        prediction: 'pneumonia',
        probability: 0.88,
        heatmapUrl: 'https://via.placeholder.com/500.png?text=Pneumonia+Heatmap',
        findings: {
          leftLung: { status: 'affected', severity: 'moderate', description: 'Opacity in lower left lobe' },
          rightLung:{ status: 'affected', severity: 'mild',     description: 'Mild infiltrates in right mid zone' }
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  const severityClass = sev => {
    if (sev === 'mild')     return isDark ? 'text-blue-400' : 'text-blue-600';
    if (sev === 'moderate') return isDark ? 'text-cyan-400' : 'text-cyan-600';
    if (sev === 'severe')   return isDark ? 'text-sky-400' : 'text-sky-600';
    return '';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pneumonia Detection</h2>
        <Link to="/dashboard" className={`px-3 py-1 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors text-sm flex items-center`}>
          <Home className="w-4 h-4 mr-1" />Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className={`${isDark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <Stethoscope className="mr-2 h-5 w-5 text-blue-500"/> {/* Changed from Lungs to Stethoscope */}
            About This Tool
          </h3>
          <p className={`${isDark?'text-slate-300':'text-slate-600'} mb-4`}>
            Deep learning model to detect pneumonia from chest X-rays. Analyzes lung patterns and returns confidence.
          </p>
          <div className={`mb-6 p-4 rounded-lg ${isDark?'bg-slate-700':'bg-slate-50'}`}>
            <h4 className="font-medium mb-2">Supported Types:</h4>
            <ul className={`${isDark?'text-slate-300':'text-slate-600'} list-disc list-inside space-y-1`}>
              <li>JPEG/JPG, PNG, DICOM</li>
              <li>Max size: 10 MB</li>
            </ul>
          </div>
          <div className={`p-3 border ${isDark?'border-amber-700 bg-amber-900/20':'border-amber-200 bg-amber-50'} rounded-md`}>
            <p className={`${isDark?'text-amber-300':'text-amber-800'} text-sm flex items-start`}>
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5"/>For assistance only—verify results with a specialist.
            </p>
          </div>
        </div>

        {/* Upload & Results */}
        <div className={`lg:col-span-2 ${isDark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4">Chest X-Ray Analysis</h3>

          {!selectedFile && (
            <div className={`border-2 border-dashed ${isDark?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'} rounded-lg p-8 text-center`}>
              <Image className={`h-12 w-12 mx-auto mb-4 ${isDark?'text-slate-500':'text-slate-400'}`}/>
              <h4 className="font-medium mb-2">Upload Chest X-Ray</h4>
              <p className={`${isDark?'text-slate-400':'text-slate-500'} mb-6 text-sm`}>Select an image for pneumonia detection</p>
              <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors inline-flex items-center">
                <Upload className="h-4 w-4 mr-2"/>Select Image
                <input id="file-upload" type="file" accept="image/*,.dcm" className="hidden" onChange={handleFileChange}/>
              </label>
            </div>
          )}

          {selectedFile && !result && !isLoading && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Selected Image</h4>
                <button onClick={resetAnalysis} className={`${isDark?'text-slate-400 hover:text-slate-300':'text-slate-500 hover:text-slate-700'} text-sm`}>Cancel</button>
              </div>
              <div className="mb-4 flex justify-center">
                <div className={`border ${isDark?'border-slate-700':'border-slate-200'} rounded-lg overflow-hidden max-w-md`}>
                  <img src={preview} alt="preview" className="w-full h-auto object-contain" style={{maxHeight:'400px'}}/>
                </div>
              </div>
              <div className="flex justify-center">
                <button onClick={handleUpload} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center">
                  <Upload className="h-4 w-4 mr-2"/>Analyze Image
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              <p className={`${isDark?'text-slate-300':'text-slate-600'} mt-4`}>Analyzing...</p>
            </div>
          )}

          {result && (
            <div>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Results</h4>
                <button onClick={resetAnalysis} className={`${isDark?'text-slate-400 hover:text-slate-300':'text-slate-500 hover:text-slate-700'} text-sm`}>New Analysis</button>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="border rounded-lg overflow-hidden">
                    <img src={preview} alt="original" className="w-full h-auto object-contain"/>
                    <div className={`p-2 ${isDark?'bg-slate-700':'bg-slate-100'} text-center text-sm`}>Original</div>
                  </div>
                </div>
                <div>
                  <div className="border rounded-lg overflow-hidden">
                    <img src={result.heatmapUrl} alt="heatmap" className="w-full h-auto object-contain"/>
                    <div className={`p-2 ${isDark?'bg-slate-700':'bg-slate-100'} text-center text-sm`}>Heatmap</div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className={`p-4 ${result.prediction==='pneumonia'?isDark?'bg-blue-900/20 border-blue-800':'bg-blue-50 border-blue-200':isDark?'bg-emerald-900/20 border-emerald-800':'bg-emerald-50 border-emerald-200'} border rounded-lg mb-6`}>
                <div className="flex items-center">
                  {result.prediction==='pneumonia'
                    ? <AlertCircle className={`h-5 w-5 mr-2 ${isDark?'text-blue-400':'text-blue-500'}`}/>
                    : <CheckCircle2 className={`h-5 w-5 mr-2 ${isDark?'text-emerald-400':'text-emerald-500'}`}/>
                  }
                  <h4 className="font-medium">{result.prediction==='pneumonia'?'Pneumonia Detected':'No Pneumonia Detected'}</h4>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className={`${isDark?'text-slate-300':'text-slate-600'} text-sm`}>Confidence:</span>
                    <span className="font-semibold">{Math.round(result.probability*100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div className={`${result.prediction==='pneumonia'?'bg-blue-500':'bg-emerald-500'} h-2 rounded-full`} style={{width:`${result.probability*100}%`}}/>
                  </div>
                </div>
              </div>

              {/* Detailed Findings */}
              <div className={`p-4 ${isDark?'bg-slate-700':'bg-slate-50'} rounded-lg mb-6`}>
                <h4 className="font-medium mb-3">Detailed Findings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(result.findings).map(([region,data])=>(
                    <div key={region} className={`${isDark?'bg-slate-800':'bg-white'} p-3 rounded-md`}>
                      <p className="capitalize font-medium">{region.replace(/([A-Z])/g,' $1')}</p>
                      <p className={`${severityClass(data.severity)} mt-1 text-sm`}>{data.status}: {data.severity}</p>
                      <p className={`text-sm ${isDark?'text-slate-400':'text-slate-600'} mt-1`}>{data.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex-1 flex items-center justify-center">
                  Save to Records
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex-1 flex items-center justify-center">
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

export default PneumoniaView;
