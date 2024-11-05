import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
      <p className="text-red-700">Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;