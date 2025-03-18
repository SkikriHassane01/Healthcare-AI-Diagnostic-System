import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import patientService from '../../services/patient.service';
import { ArrowLeft, Save } from 'lucide-react';

const PatientForm = ({ mode = 'create' }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    email: '',
    phone: '',
    address: '',
    medical_history: '',
    height: '',
    weight: '',
    allergies: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Load patient data if editing
  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchPatient = async () => {
        setLoading(true);
        try {
          const result = await patientService.getPatient(id);
          // Format date for input field (YYYY-MM-DD)
          const formattedData = {
            ...result.patient,
            date_of_birth: result.patient.date_of_birth
              ? new Date(result.patient.date_of_birth).toISOString().split('T')[0]
              : ''
          };
          setFormData(formattedData);
        } catch (err) {
          setError(err.message || 'Failed to load patient data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPatient();
    }
  }, [mode, id]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    
    // Email validation
    if (formData.email && !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Number validation for height and weight
    
    if (formData.height && isNaN(formData.height)) {
      errors.height = 'Height must be a number';
    }
    
    if (formData.weight && isNaN(formData.weight)) {
      errors.weight = 'Weight must be a number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create or update patient
      if (mode === 'edit' && id) {
        await patientService.updatePatient(id, formData);
      } else {
        await patientService.createPatient(formData);
      }
      
      // Navigate back to patient list
      navigate('/patients');
    } catch (err) {
      setError(err.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} patient`);
      setLoading(false);
    }
  };
  
  return (
    <div className={`p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/patients')}
            className={`mr-4 p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {mode === 'edit' ? 'Edit Patient' : 'Add New Patient'}
          </h1>
        </div>
        
        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading && mode === 'edit' ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin mb-4"></div>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Loading patient data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg border shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className={`block mb-1 text-sm font-medium ${formErrors.first_name ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.first_name ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.first_name && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.first_name}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className={`block mb-1 text-sm font-medium ${formErrors.last_name ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.last_name ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.last_name && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.last_name}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className={`block mb-1 text-sm font-medium ${formErrors.date_of_birth ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.date_of_birth ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.date_of_birth && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.date_of_birth}</p>
                  )}
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className={`block mb-1 text-sm font-medium ${formErrors.gender ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.gender ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.gender}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg border shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className={`block mb-1 text-sm font-medium ${formErrors.email ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } border ${formErrors.email ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-rose-500">{formErrors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
              </div>
              
              {/* Address */}
              <div>
                <label htmlFor="address" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg border shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Height */}
                <div>
                  <label htmlFor="height" className={`block mb-1 text-sm font-medium ${formErrors.height ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.height ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.height && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.height}</p>
                  )}
                </div>
                
                {/* Weight */}
                <div>
                  <label htmlFor="weight" className={`block mb-1 text-sm font-medium ${formErrors.weight ? 'text-rose-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    } border ${formErrors.weight ? 'border-rose-500' : ''} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {formErrors.weight && (
                    <p className="mt-1 text-sm text-rose-500">{formErrors.weight}</p>
                  )}
                </div>
              </div>
              
              {/* Medical History */}
              <div className="mb-4">
                <label htmlFor="medical_history" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Medical History
                </label>
                <textarea
                  id="medical_history"
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="Enter any relevant medical history"
                />
              </div>
              
              {/* Allergies */}
              <div>
                <label htmlFor="allergies" className={`block mb-1 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="List any allergies"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/patients')}
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Patient'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientForm;