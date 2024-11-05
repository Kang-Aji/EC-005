import React from 'react';
import { format } from 'date-fns';

const BillCard = ({ session }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{session.state_name} Legislative Session</h3>
      <div className="text-sm text-gray-600 mt-2">
        <p>Session: {session.session_name}</p>
        <p>Year: {session.year_start} - {session.year_end}</p>
        <p>Status: {session.session_status}</p>
        {session.special && <p className="text-blue-600">Special Session</p>}
      </div>
    </div>
  );
};

export default BillCard;