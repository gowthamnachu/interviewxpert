// src/components/AnswerSuggestion.js
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import questionsData from '../data/questions';

const AnswerSuggestion = () => {
  const { id } = useParams();
  const location = useLocation();
  const domain = new URLSearchParams(location.search).get('domain');
  const question = questionsData[domain][id];

  return (
    <div className="card">
      <h2>Suggested Answer</h2>
      <p>{question.answer}</p>
    </div>
  );
};

export default AnswerSuggestion;
