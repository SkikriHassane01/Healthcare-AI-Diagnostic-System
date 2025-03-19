import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import patientService from '../../services/patient.service';
import { ArrowLeft, Edit, Trash2, Calendar, Mail, Phone, MapPin, Ruler, Weight, AlertCircle, AlertTriangle } from 'lucide-react';

const PatientDetail = () => {
  const { isDark } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await patientService.getPatient(id);
        setPatient(data.patient);
      } catch (err) {
        setError(err.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      await patientService.deletePatient(id);
      navigate('/patients');
    } catch (err) {
      setError(err.message || 'Failed to delete patient');
    }
  };
  
  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      // Try to parse the date - if it fails, return a fallback
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date format error';
    }
  };
  
  if (loading) {
    return (
      <div className={`p-6 min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin mb-4"></div>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading patient information...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md mb-6">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/patients')}
              className="mt-2 text-sm font-medium text-rose-700 hover:text-rose-800"
            >
              Return to Patient List
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md mb-6">
            <p>Patient not found</p>
            <button 
              onClick={() => navigate('/patients')}
              className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              Return to Patient List
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/patients')}
            className={`flex items-center p-2 rounded-md ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Patients</span>
          </button>
          
          <div className="flex space-x-3">
            <Link
              to={`/patients/${id}/edit`}
              className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md shadow-sm transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Link>
            <button
              onClick={() => setDeleteConfirmation(true)}
              className="flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md shadow-sm transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        {/* Patient Information */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
              <span className="text-2xl font-bold">
                {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
              </span>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-1">{patient.full_name}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {patient.age} years old ({new Date(patient.date_of_birth).toLocaleDateString()})
                  </span>
                </div>
                <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>•</span>
                  <span className="ml-1">
                    {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Prefer not to say'}
                  </span>
                </div>
                <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>•</span>
                  <span className="ml-1">
                    ID: {patient.id?.substring(0, 8)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {patient.email && (
                  <a href={`mailto:${patient.email}`} className={`flex items-center px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-sky-400' : 'bg-slate-100 hover:bg-slate-200 text-sky-600'} transition-colors`}>
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    {patient.email}
                  </a>
                )}
                {patient.phone && (
                  <a href={`tel:${patient.phone}`} className={`flex items-center px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-sky-400' : 'bg-slate-100 hover:bg-slate-200 text-sky-600'} transition-colors`}>
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    {patient.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Contact Information</h2>
              
              <div className="space-y-4">
                {patient.address ? (
                  <div className="flex">
                    <MapPin className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Address</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {patient.address}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <MapPin className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Address</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} italic`}>
                        No address provided
                      </p>
                    </div>
                  </div>
                )}
                
                {patient.email ? (
                  <div className="flex">
                    <Mail className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Email</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {patient.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Mail className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Email</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} italic`}>
                        No email provided
                      </p>
                    </div>
                  </div>
                )}
                
                {patient.phone ? (
                  <div className="flex">
                    <Phone className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Phone</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {patient.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Phone className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Phone</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} italic`}>
                        No phone number provided
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Medical Information */}
            <div className="md:col-span-2">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Medical Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Height and Weight */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div className="flex">
                    <Ruler className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
                    <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Height</h3>
                  </div>
                  <p className={`mt-1 ${patient.height ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-400 italic' : 'text-slate-500 italic')}`}>
                    {patient.height ? `${patient.height} cm` : 'Not recorded'}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div className="flex">
                    <Weight className={`w-5 h-5 mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'} flex-shrink-0`} />
                    <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Weight</h3>
                  </div>
                  <p className={`mt-1 ${patient.weight ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-400 italic' : 'text-slate-500 italic')}`}>
                    {patient.weight ? `${patient.weight} kg` : 'Not recorded'}
                  </p>
                </div>
              </div>
              
              {/* Medical History */}
              <div className="mb-4">
                <div className="flex mb-2">
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Medical History</h3>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <p className={`${patient.medical_history ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-400 italic' : 'text-slate-500 italic')}`}>
                    {patient.medical_history || 'No medical history recorded'}
                  </p>
                </div>
              </div>
              
              {/* Allergies */}
              <div className="mb-4">
                <div className="flex mb-2">
                  <AlertCircle className={`w-5 h-5 mr-2 ${isDark ? 'text-amber-400' : 'text-amber-600'} flex-shrink-0`} />
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Allergies</h3>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <p className={`${patient.allergies ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-400 italic' : 'text-slate-500 italic')}`}>
                    {patient.allergies || 'No allergies recorded'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Diagnostics Section */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Diagnostic Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diabetes Assessment Card */}
            <div className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-lg border p-4 transition-transform hover:-translate-y-1 duration-200`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-md font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Diabetes Assessment</h3>
                </div>
              </div>
              
              <p className={`mb-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Assess patient's risk of diabetes based on clinical data and biomarkers.
              </p>
              
              <div className="flex space-x-2">
                <Link
                  to={`/patients/${id}/diabetes-assessment`}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-md shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  New Assessment
                </Link>
                <Link
                  to={`/patients/${id}/diabetes-history`}
                  className={`flex items-center justify-center px-3 py-2 rounded-md shadow-sm transition-colors text-sm ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </Link>
              </div>
            </div>
            
            {/* Brain Tumor Detection Card */}
            <div className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-lg border p-4 transition-transform hover:-translate-y-1 duration-200`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-md font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Brain Tumor Detection</h3>
                </div>
              </div>
              
              <p className={`mb-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Analyze MRI scans to detect brain tumors with advanced image recognition.
              </p>
              
              <div className="flex space-x-2">
                <button 
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm rounded-md shadow-sm transition-colors bg-slate-400 text-slate-50 cursor-not-allowed"
                  disabled
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional actions */}
        <div className="flex justify-between items-center">
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Last updated: {formatDate(patient.updated_at)}
          </div>
          <Link
            to={`/patients/${id}/edit`}
            className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient Information
          </Link>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 max-w-md mx-auto shadow-xl`}>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-500 mr-3" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Are you sure you want to delete {patient.full_name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(false)}
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-colors"
              >
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;