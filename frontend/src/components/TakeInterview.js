import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const TakeInterview = ({ selectedDomain }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDomain) {
      fetchQuestions();
    }
  }, [selectedDomain]);

  const fetchQuestions = async () => {
    try {
      console.log('Fetching from:', `${config.apiUrl}/questions?domain=${selectedDomain}`);
      const response = await axios.get(`${config.apiUrl}/questions?domain=${selectedDomain}`);
      console.log('Response:', response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error.response || error);
      setError('Failed to fetch questions. Please try again.');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
};

export default TakeInterview;