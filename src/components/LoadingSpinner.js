import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading questions' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <div className="loading-text">
        {message}<span className="loading-dots"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;