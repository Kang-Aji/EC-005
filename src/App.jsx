import React from 'react';
import LegislativeTracker from './components/LegislativeTracker';
import NewsSection from './components/NewsSection';

const App = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">US Government News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LegislativeTracker />
        <NewsSection />
      </div>
    </div>
  );
};

export default App;