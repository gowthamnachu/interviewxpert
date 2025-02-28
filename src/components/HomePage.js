import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to InterviewXpert</h1>
      <h2>ACE YOUR INTERVIEW , WITH InterviewXpert</h2>
      <p>Choose your domain and start preparing for your interviews.</p>
      <button onClick={() => navigate("/select-domain")}>Start Preparing</button>
    </div>
  );
};

export default HomePage;
