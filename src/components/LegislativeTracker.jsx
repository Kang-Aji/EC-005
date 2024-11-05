import React, { useState, useEffect } from 'react';
import { fetchBills, fetchOfficialVotes } from '../services/api';

const LegislativeTracker = () => {
  const [bills, setBills] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [billsResponse, votesResponse] = await Promise.all([
          fetchBills(),
          fetchOfficialVotes('default')
        ]);

        if (!billsResponse.success) {
          throw new Error(billsResponse.error);
        }
        if (!votesResponse.success) {
          throw new Error(votesResponse.error);
        }

        setBills(billsResponse.data);
        setVotes(votesResponse.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading legislative data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Legislative Activity</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Bills</h3>
        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill.id} className="border p-4 rounded">
              <h4 className="font-medium">{bill.title}</h4>
              <p className="text-sm text-gray-600">Status: {bill.status}</p>
              <p className="text-sm text-gray-600">Last Action: {bill.lastAction}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Votes</h3>
        <div className="space-y-4">
          {votes.map(vote => (
            <div key={vote.id} className="border p-4 rounded">
              <p className="font-medium">Bill ID: {vote.billId}</p>
              <p className="text-sm text-gray-600">Vote: {vote.vote}</p>
              <p className="text-sm text-gray-600">Date: {vote.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegislativeTracker;