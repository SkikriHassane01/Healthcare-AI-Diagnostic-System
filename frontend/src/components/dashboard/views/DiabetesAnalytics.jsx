import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DiabetesForm from '../../diagnostics/diabetes/DiabetesForm';

const DiabetesAnalytics = ({ isDark }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [analysisDone, setAnalysisDone] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');

    fetch('/api/patients', {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setError('Failed to load patients.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePatientSelect = (id) => {
    setSelectedPatient(id);
    setAnalysisDone(false);
    setFormKey(prev => prev + 1);
  };

  const handleAnalysisComplete = () => setAnalysisDone(true);
  const handleTestAgain = () => {
    setSelectedPatient('');
    setAnalysisDone(false);
    setFormKey(prev => prev + 1);
  };

  return (
    <div className={`${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} p-6 min-h-screen`}>      
      <h2 className="text-2xl font-bold mb-6">Diabetes Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* About Diabetes */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4`}>          
          <h3 className="font-semibold mb-2">About Diabetes</h3>
          <p className="text-sm mb-4">
            Diabetes is a chronic condition where the body cannot properly process blood sugar. Early detection
            and management prevent serious complications.
          </p>
          <h4 className="font-medium mb-2">Model Performance</h4>
          <div className="flex space-x-4">
            <div>
              <p className="text-sm">Accuracy</p>
              <p className="text-lg font-bold">92%</p>
            </div>
            <div>
              <p className="text-sm">Recall</p>
              <p className="text-lg font-bold">89%</p>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Select Patient Cards */}
          <section className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4`}>            
            <h3 className="font-semibold mb-4">1. Select Patient</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {loading ? (
              <p>Loading patients...</p>
            ) : patients.length === 0 ? (
              <p>No patients found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map(p => {
                  const isSelected = selectedPatient === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePatientSelect(p.id)}
                      className={`cursor-pointer border rounded-lg p-4 transition-shadow ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-lg'
                          : isDark
                          ? 'bg-slate-700 hover:shadow-md'
                          : 'bg-white hover:shadow-md'
                      }`}
                    >
                      <h4 className="font-semibold text-lg mb-2">{p.name}</h4>
                      <p className="text-sm">Age: {p.age}</p>
                      <p className="text-sm">Gender: {p.gender}</p>
                      <p className="text-sm">Phone: {p.phone}</p>
                      <p className="text-sm truncate">Email: {p.email}</p>
                      <p className="text-sm truncate">Address: {p.address}</p>
                      <Link
                        to={`/patients/${p.id}`}
                        className={`${isSelected ? 'text-white' : 'text-sky-600'} underline text-xs mt-2 block`}
                      >
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 2. Enter Data */}
          {selectedPatient && (
            <section className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4`}>
              <h3 className="font-semibold mb-2">2. Enter Data</h3>
              <DiabetesForm
                key={formKey}
                patientId={selectedPatient}
                onComplete={handleAnalysisComplete}
              />
            </section>
          )}

          {/* 3. Assign Diagnostic */}
          {selectedPatient && (
            <section className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4`}>
              <h3 className="font-semibold mb-2">3. Assign Diagnostic</h3>
              <button
                onClick={() => {/* handle assignment logic here */}}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
              >
                Assign Diagnostic
              </button>
            </section>
          )}

          {/* 4. History & Retest */}
          {analysisDone && (
            <section className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4`}>
              <h3 className="font-semibold mb-2">4. History & Retest</h3>
              <div className="space-y-2">
                <Link
                  to={`/patients/${selectedPatient}/diabetes-history`}
                  className="underline text-blue-500"
                >
                  View History
                </Link>
                <button
                  onClick={handleTestAgain}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
                >
                  Test Again
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default DiabetesAnalytics;
