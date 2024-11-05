import React, { useState, useEffect } from 'react';
import { legislativeApi } from '../services/api';
import OfficialVoteRecord from './OfficialVoteRecord';

const OfficialLegislativeTracker = () => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  useEffect(() => {
    const loadOfficialData = async () => {
      try {
        setLoading(true);
        const data = await legislativeApi.getOfficials();
        setOfficials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOfficialData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Elected Officials Activity</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Select Official</h3>
          {officials.map(official => (
            <button
              key={official.id}
              onClick={() => setSelectedOfficial(official)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedOfficial?.id === official.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="font-medium">{official.name}</div>
              <div className="text-sm text-gray-600">{official.role}</div>
              <div className="text-sm text-gray-500">{official.state}</div>
            </button>
          ))}
        </div>

        <div>
          {selectedOfficial ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {selectedOfficial.name}'s Activity
              </h3>
              <OfficialVoteRecord officialId={selectedOfficial.id} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an official to view their legislative activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficialLegislativeTracker;