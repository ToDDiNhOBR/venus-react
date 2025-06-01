import React, { useState, useEffect } from 'react';

const SheetsTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const profileData = await response.json();
        setData(profileData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Google Sheets Connection Test</h2>
        <div>Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Google Sheets Connection Test</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Google Sheets Connection Test</h2>
      {data ? (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-2">Data loaded successfully:</h3>
          <pre className="bg-gray-50 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No data found
        </div>
      )}
    </div>
  );
};

export default SheetsTest;
