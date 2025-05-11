import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import patientService from '../../../services/patient.service';
import { 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  FileBarChart2, 
  ArrowRight, 
  BarChart3,
  Search,
  User,
  Calendar,
  Users,
  X
} from 'lucide-react';

const BreastCancerView = ({ isDark }) => {
  const navigate = useNavigate();
  
  // State variables for different steps
  const [step, setStep] = useState('select-patient'); // 'select-patient', 'enter-data', 'results'
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Patient list state
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientError, setPatientError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state for breast cancer metrics
  const [formData, setFormData] = useState({
    radius_mean: '',
    texture_mean: '',
    perimeter_mean: '',
    area_mean: '',
    smoothness_mean: '',
    compactness_mean: '',
    concavity_mean: '',
    concave_points_mean: '',
    symmetry_mean: '',
    fractal_dimension_mean: ''
  });
  
  // Results/validation state
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatients();
        if (response && response.patients) {
          setPatients(response.patients);
        } else {
          setPatientError('Failed to load patients data');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setPatientError(err.message || 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setStep('enter-data');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter patients based on search term
  const filteredPatients = searchTerm.trim() === '' 
    ? patients 
    : patients.filter(patient => {
        const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase();
        const email = (patient.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower);
      });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check if all fields have values and are numbers
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        errors[key] = 'Required';
        isValid = false;
      } else if (isNaN(parseFloat(value))) {
        errors[key] = 'Must be a number';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock result
      setResult({
        prediction: 'malignant',
        probability: 0.87,
        featureImportance: [
          { feature: 'concave_points_mean', importance: 0.28 },
          { feature: 'radius_mean', importance: 0.21 },
          { feature: 'perimeter_mean', importance: 0.18 },
          { feature: 'area_mean', importance: 0.15 },
          { feature: 'concavity_mean', importance: 0.08 },
          { feature: 'texture_mean', importance: 0.05 },
          { feature: 'compactness_mean', importance: 0.03 },
          { feature: 'symmetry_mean', importance: 0.01 },
          { feature: 'smoothness_mean', importance: 0.01 },
          { feature: 'fractal_dimension_mean', importance: 0.00 }
        ]
      });
      setIsLoading(false);
      setStep('results');
    }, 2000);
  };

  // Reset the assessment
  const resetAnalysis = () => {
    setFormData({
      radius_mean: '',
      texture_mean: '',
      perimeter_mean: '',
      area_mean: '',
      smoothness_mean: '',
      compactness_mean: '',
      concavity_mean: '',
      concave_points_mean: '',
      symmetry_mean: '',
      fractal_dimension_mean: ''
    });
    setFormErrors({});
    setResult(null);
    setSelectedPatient(null);
    setStep('select-patient');
  };

  // Go back to data entry from results
  const backToDataEntry = () => {
    setResult(null);
    setStep('enter-data');
  };
  
  // Go back to patient selection
  const backToPatientSelection = () => {
    setSelectedPatient(null);
    setStep('select-patient');
  };

  // Load sample data
  const loadSampleData = () => {
    setFormData({
      radius_mean: '17.99',
      texture_mean: '10.38',
      perimeter_mean: '122.8',
      area_mean: '1001',
      smoothness_mean: '0.1184',
      compactness_mean: '0.2776',
      concavity_mean: '0.3001',
      concave_points_mean: '0.1471',
      symmetry_mean: '0.2419',
      fractal_dimension_mean: '0.07871'
    });
    setFormErrors({});
  };

  // Helper function to display feature names in a more readable format
  const formatFeatureName = (name) => {
    return name
      .replace('_mean', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Breast Cancer Detection</h2>
        <Link to="/dashboard" className={`px-3 py-1 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors text-sm flex items-center`}>
          <Home className="w-4 h-4 mr-1" />Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className={`${isDark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          <h3 className="font-semibold mb-4 flex items-center">
            <FileBarChart2 className="mr-2 h-5 w-5 text-pink-500"/>About This Tool
          </h3>
          <p className={`${isDark?'text-slate-300':'text-slate-600'} mb-4`}>
            This AI model analyzes Fine Needle Aspiration (FNA) test data to determine if a breast mass is benign or malignant with high accuracy.
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${isDark?'bg-slate-700':'bg-slate-50'}`}>
            <h4 className="font-medium mb-2">About the biomarkers:</h4>
            <ul className={`${isDark?'text-slate-300':'text-slate-600'} list-disc list-inside space-y-1`}>
              <li><span className="font-medium">Radius</span>: Mean distance from center to points on the perimeter</li>
              <li><span className="font-medium">Texture</span>: Standard deviation of gray-scale values</li>
              <li><span className="font-medium">Perimeter</span>: Perimeter of the cell nucleus</li>
              <li><span className="font-medium">Area</span>: Area of the cell nucleus</li>
              <li><span className="font-medium">Smoothness</span>: Local variation in radius lengths</li>
              <li><span className="font-medium">Compactness</span>: Perimeter² / area - 1.0</li>
              <li><span className="font-medium">Concavity</span>: Severity of concave portions of the contour</li>
              <li><span className="font-medium">Concave points</span>: Number of concave portions of the contour</li>
              <li><span className="font-medium">Symmetry</span>: Symmetry of the cell nucleus</li>
              <li><span className="font-medium">Fractal dimension</span>: "Coastline approximation" - 1</li>
            </ul>
          </div>
          
          <div className={`p-3 border ${isDark?'border-amber-700 bg-amber-900/20':'border-amber-200 bg-amber-50'} rounded-md`}>
            <p className={`${isDark?'text-amber-300':'text-amber-800'} text-sm flex items-start`}>
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
              This tool is for assistance only. Always confirm results with laboratory testing and clinical assessment.
            </p>
          </div>
        </div>

        {/* Main Section - Changes based on step */}
        <div className={`lg:col-span-2 ${isDark?'bg-slate-800 border-slate-700':'bg-white border-slate-200'} rounded-lg shadow-sm border p-4`}>
          {/* Step 1: Patient Selection */}
          {step === 'select-patient' && (
            <div>
              <h3 className="font-semibold mb-4">Select a Patient</h3>
              
              {patientError && (
                <div className={`p-3 mb-4 border ${isDark ? 'border-rose-700 bg-rose-900/20 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-800'} rounded-md`}>
                  {patientError}
                </div>
              )}
              
              <div className="mb-4 relative">
                <div className={`flex items-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-md pl-3`}>
                  <Search className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input 
                    type="text" 
                    placeholder="Search patients by name or email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`w-full p-2 rounded-md ${
                      isDark 
                        ? 'bg-slate-700 text-white placeholder-slate-400' 
                        : 'bg-slate-100 text-slate-800 placeholder-slate-500'
                    } border-0 focus:outline-none focus:ring-0`}
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
                  <p className={`mt-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading patients...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className={`inline-block h-10 w-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {searchTerm ? 'No patients match your search' : 'No patients found'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-[500px] overflow-y-auto p-1">
                  {filteredPatients.map(patient => (
                    <div 
                      key={patient.id}
                      className={`${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'} p-4 rounded-lg cursor-pointer transition-colors`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex items-start">
                        <div className={`${isDark ? 'bg-slate-600' : 'bg-white'} h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                          <User className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                        </div>
                        <div className="flex-grow">
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className={`h-4 w-4 mr-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                              <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                Age: {patient.age}
                              </span>
                            </div>
                            
                            <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              Gender: {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                            </div>
                            
                            {patient.email && (
                              <div className={`col-span-2 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                Email: {patient.email}
                              </div>
                            )}
                            
                            {patient.phone && (
                              <div className={`col-span-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                Phone: {patient.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <button className={`${isDark ? 'bg-pink-700 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-500'} text-white p-2 rounded-md transition-colors`}>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Data Entry */}
          {step === 'enter-data' && selectedPatient && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">FNA Test Data Analysis</h3>
                <button 
                  onClick={backToPatientSelection}
                  className={`text-sm flex items-center ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <X className="h-4 w-4 mr-1" />
                  Change Patient
                </button>
              </div>
              
              {/* Selected Patient Card */}
              <div className={`mb-4 p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                <div className="flex items-center">
                  <div className={`${isDark ? 'bg-slate-600' : 'bg-white'} h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                    <User className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedPatient.full_name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}
                    </h4>
                    <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Age: {selectedPatient.age}, 
                      Gender: {selectedPatient.gender === 'male' ? 'Male' : selectedPatient.gender === 'female' ? 'Female' : 'Other'}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={loadSampleData}
                    className={`text-sm px-3 py-1 ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } rounded flex items-center`}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Load Sample Data
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.keys(formData).map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field}
                        className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {formatFeatureName(field)}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded-md border ${
                          formErrors[field]
                            ? 'border-red-500'
                            : isDark
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                        placeholder={`Enter ${formatFeatureName(field).toLowerCase()}`}
                      />
                      {formErrors[field] && (
                        <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Analyze Data
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
              <p className={`${isDark?'text-slate-300':'text-slate-600'} mt-4`}>Analyzing data...</p>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && result && (
            <div>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Analysis Results</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={backToDataEntry}
                    className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Edit Data
                  </button>
                  <button 
                    onClick={resetAnalysis}
                    className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Patient Info */}
              {selectedPatient && (
                <div className={`mb-4 p-3 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <div className="flex items-center">
                    <div className={`${isDark ? 'bg-slate-600' : 'bg-white'} h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                      <User className={`h-5 w-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {selectedPatient.full_name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}
                      </h4>
                      <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Age: {selectedPatient.age}, 
                        Gender: {selectedPatient.gender === 'male' ? 'Male' : selectedPatient.gender === 'female' ? 'Female' : 'Other'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className={`p-4 ${result.prediction==='malignant'?isDark?'bg-rose-900/20 border-rose-800':'bg-rose-50 border-rose-200':isDark?'bg-emerald-900/20 border-emerald-800':'bg-emerald-50 border-emerald-200'} border rounded-lg mb-6`}>
                <div className="flex items-center">
                  {result.prediction==='malignant'
                    ? <AlertCircle className={`h-5 w-5 mr-2 ${isDark?'text-rose-400':'text-rose-500'}`}/>
                    : <CheckCircle2 className={`h-5 w-5 mr-2 ${isDark?'text-emerald-400':'text-emerald-500'}`}/>
                  }
                  <h4 className="font-medium">{result.prediction==='malignant'?'Malignant (Cancerous)':'Benign (Non-Cancerous)'}</h4>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className={`${isDark?'text-slate-300':'text-slate-600'} text-sm`}>Confidence:</span>
                    <span className="font-semibold">{Math.round(result.probability*100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div className={`${result.prediction==='malignant'?'bg-rose-500':'bg-emerald-500'} h-2 rounded-full`} style={{width:`${result.probability*100}%`}}/>
                  </div>
                </div>
              </div>



              {/* Patient Data Summary */}
              <div className={`p-4 ${isDark?'bg-slate-700':'bg-slate-50'} rounded-lg mb-6`}>
                <h4 className="font-medium mb-3">Analyzed Data Values</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {formatFeatureName(key)}:
                      </span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => {
                    alert(`Results saved to ${selectedPatient.first_name} ${selectedPatient.last_name}'s medical records`);
                    resetAnalysis();
                  }}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors flex-1 flex items-center justify-center"
                >
                  Save to Patient Records
                </button>
                <button 
                  onClick={() => {
                    const filename = `breast_cancer_analysis_${selectedPatient.first_name}_${selectedPatient.last_name}_${new Date().toISOString().split('T')[0]}.pdf`;
                    alert(`Report exported as ${filename}`);
                  }}
                  className="px-4 py-2 border border-pink-600 text-pink-600 hover:bg-pink-50 rounded-md transition-colors flex-1 flex items-center justify-center"
                >
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

export default BreastCancerView;