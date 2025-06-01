import React, { useState, useEffect } from 'react';

const SheetExample = () => {
  const [clientsData, setClientsData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile data from backend API
        const profileResponse = await fetch('http://localhost:5000/api/admin/profile');
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profile = await profileResponse.json();
        setProfileData(profile);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh data after update
      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
    } catch (err) {
      console.error('Error updating data:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold">Error loading data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile Data</h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(profileData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
                <div className="mt-1 text-sm text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetExample;
