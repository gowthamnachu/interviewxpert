import React from "react";
import { useLocation } from "react-router-dom";
import questionsData from "../data/questions";

const QuestionList = () => {
  const location = useLocation();
  const selectedDomain = location.state?.domain || "Software Engineering"; // Default to Software Engineering if no domain selected

  return (
    <div className="question-container">
      <h2>{selectedDomain} Interview Questions</h2>
      <div className="question-list">
        {questionsData[selectedDomain]?.map((item, index) => (
          <div key={index} className="question-card">
            <h3 className="question">{index + 1}. {item.question}</h3>
            <p className="answer">{item.answer}</p>
          </div>
        )) || <p>No questions available for this domain.</p>}
      </div>
    </div>
  );
};

export default QuestionList;
