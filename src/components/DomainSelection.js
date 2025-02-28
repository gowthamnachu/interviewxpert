import React from 'react';
import { useNavigate } from 'react-router-dom';

const domains = [
  "Software Engineering", 
  "Data Science", 
  "Product Management", 
  "Marketing", 
  "Cloud Computing"
];

const DomainSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="domain-container">
      <h2>Select Your Interview Domain</h2>
      <div className="domain-grid">
        {domains.map((domain, index) => (
          <button 
            key={index} 
            className="domain-button" 
            onClick={() => navigate("/questions", { state: { domain } })}
          >
            {domain}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainSelection;
