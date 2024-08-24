import React from 'react';
import ReactDOM from 'react-dom';
import LazyComponent from './LazyComponent'; // Import the lazy-loaded component

const LazyLoader = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
};

export default LazyLoader;