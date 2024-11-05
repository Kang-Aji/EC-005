import React, { useState, useEffect } from 'react';
import { legislativeApi } from '../services/api';

const OfficialVoteRecord = ({ officialId }) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVotes = async () => {
      try {
        setLoading(true);
        const data = await legislativeApi.getOfficialVotes(officialId);
        setVotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (officialId) {
      loadVotes();
    }
  }, [officialId]);

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
    <div className="space-y-4">
      {votes.map(vote => (
        <div
          key={vote.roll_call_id}
          className="border rounded-lg p-4 hover:bg-gray-50"
        >
          <h4 className="font-medium">{vote.bill_title}</h4>
          <p className="text-sm text-gray-600 mt-1">{vote.description}</p>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-500">{vote.date}</span>
            <span className={`font-medium ${
              vote.vote_text === 'Yea' ? 'text-green-600' : 'text-red-600'
            }`}>
              {vote.vote_text}
            </span>
          </div>
        </div>
      ))}
      {votes.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          No voting records found
        </div>
      )}
    </div>
  );
};

export default OfficialVoteRecord;