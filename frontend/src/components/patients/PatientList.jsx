import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import patientService from '../../services/patient.service';
import { 
  Search, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  UserX
} from 'lucide-react';

const PatientList = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // State variables
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [perPage] = useState(10);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [modalMode, setModalMode] = useState('delete'); // 'delete' or 'manage'

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log('PatientList: Fetching patients...');
        setLoading(true);
        
        const response = await patientService.getPatients({
          search: searchTerm,
          page: currentPage,
          per_page: perPage
        });
        
        console.log('PatientList: Received patient data:', response);
        
        if (!response || !response.patients) {
          throw new Error('Invalid response format from API');
        }
        
        setPatients(response.patients);
        setTotalPages(response.pagination?.pages || 1);
        setTotalPatients(response.pagination?.total || response.patients.length);
        setError('');
      } catch (err) {
        console.error('PatientList: Error fetching patients:', err);
        setError(err.message || 'Failed to load patients. Please try again later.');
        setPatients([]); // Don't use mock data
      } finally {
        setLoading(false);
      }
    };
  
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, perPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle patient deletion
  const handleDeletePatient = async (patientId) => {
    try {
      await patientService.deletePatient(patientId);
      // Remove patient from the list without refetching
      setPatients(patients.filter(p => p.id !== patientId));
      setTotalPatients(prev => prev - 1);
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.message || 'Failed to delete patient');
    }
  };

  // Handle patient deactivation
  const handleDeactivatePatient = async (patientId) => {
    try {
      await patientService.updatePatient(patientId, { active: false });
      // Update patient status without refetching the whole list
      setPatients(patients.map(p => 
        p.id === patientId ? { ...p, active: false } : p
      ));
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.message || 'Failed to deactivate patient');
    }
  };

  // Handle patient reactivation
  const handleReactivatePatient = async (patientId) => {
    try {
      await patientService.updatePatient(patientId, { active: true });
      setPatients(patients.map(p => 
        p.id === patientId ? { ...p, active: true } : p
      ));
    } catch (err) {
      setError(err.message || 'Failed to reactivate patient');
    }
  };

  // Confirm deletion/management modal
  const DeleteConfirmation = ({ patient, onConfirm, onDeactivate, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md mx-4`}>
        <h3 className="text-lg font-bold mb-4">Patient Management</h3>
        <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} mb-6`}>
          What would you like to do with <span className="font-semibold">{patient.full_name}</span>?
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onDeactivate}
            className={`px-4 py-2 rounded-md ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'} text-white transition-colors flex items-center justify-center`}
          >
            <UserX className="w-4 h-4 mr-2" />
            Mark as Inactive
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Permanently
          </button>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with title and add button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Patient Management</h1>
        <div className="flex space-x-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center px-4 py-2 border border-sky-600 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-400 dark:hover:bg-sky-900/30 rounded-md shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <Link
            to="/patients/new"
            className="flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-md transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add New Patient
          </Link>
        </div>
      </div>
        
        {/* Search and Filters */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border p-4 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`pl-10 pr-4 py-2 w-full rounded-md ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Patient Table */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border overflow-hidden mb-6`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
              <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center">
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchTerm ? 'No patients match your search criteria.' : 'No patients found. Add your first patient!'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`mt-2 inline-flex items-center px-3 py-1.5 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors text-sm`}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                      Name
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider hidden md:table-cell`}>
                      Age / Gender
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider hidden md:table-cell`}>
                      Contact
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'divide-slate-700' : 'divide-slate-200'} divide-y`}>
                  {patients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      className={`${patient.active === false ? (isDark ? 'bg-slate-700/30' : 'bg-slate-100') : ''} ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} transition-colors cursor-pointer`}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-200'} flex items-center justify-center`}>
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                              {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className={`font-medium ${patient.active === false ? (isDark ? 'text-slate-400' : 'text-slate-500') : ''}`}>
                              {patient.full_name}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} md:hidden`}>
                              {patient.age} y/o, {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'Other'}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} md:hidden`}>
                              {patient.phone || patient.email || 'No contact info'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm">
                          {patient.age} years old
                          <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Prefer not to say'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className={`text-sm ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>
                          {patient.email}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {patient.phone || 'No phone number'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            patient.active === false 
                              ? (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600') 
                              : (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                          }`}
                        >
                          {patient.active === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/patients/${patient.id}`);
                          }}
                          className={`inline-flex items-center p-1.5 rounded-full ${
                            isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                          } transition-colors`}
                        >
                          <Eye className={`h-4 w-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/patients/${patient.id}/edit`);
                          }}
                          className={`inline-flex items-center p-1.5 rounded-full ${
                            isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                          } transition-colors`}
                        >
                          <Edit className={`h-4 w-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        </button>
                        {patient.active === false ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactivatePatient(patient.id);
                            }}
                            className={`inline-flex items-center p-1.5 rounded-full ${
                              isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                            } transition-colors`}
                            title="Reactivate patient"
                          >
                            <svg className={`h-4 w-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation(patient);
                            }}
                            className={`inline-flex items-center p-1.5 rounded-full ${
                              isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                            } transition-colors`}
                          >
                            <Trash2 className={`h-4 w-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && patients.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4 sm:mb-0`}>
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalPatients)} of {totalPatients} patients
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                    : isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                } transition-colors disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    page === currentPage
                      ? 'bg-sky-600 text-white'
                      : isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                    : isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                } transition-colors disabled:cursor-not-allowed`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Delete/Manage Confirmation Modal */}
        {deleteConfirmation && (
          <DeleteConfirmation
            patient={deleteConfirmation}
            onConfirm={() => handleDeletePatient(deleteConfirmation.id)}
            onDeactivate={() => handleDeactivatePatient(deleteConfirmation.id)}
            onCancel={() => setDeleteConfirmation(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientList;