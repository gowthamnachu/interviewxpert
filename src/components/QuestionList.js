import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import config from "../config";
import "./QuestionList.css";

const QuestionList = () => {
  const location = useLocation();
  const selectedDomain = location.state?.domain || "Software Engineering";
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/questions?domain=${encodeURIComponent(selectedDomain)}`);
        if (response.data.length === 0) {
          setError(`No questions available for ${selectedDomain}`);
        } else {
          setQuestions(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedDomain]);

  const highlightSearchText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  const filteredQuestions = questions.filter(question => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      question.text.toLowerCase().includes(searchLower) ||
      question.answer.toLowerCase().includes(searchLower) ||
      question.expected?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <div className="question-list-loader">
      <div className="loader-spinner"></div>
      <p>Loading questions...</p>
    </div>;
  }

  if (error) {
    return <div className="question-list-error">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
    </div>;
  }

  return (
    <div className="question-list-container">
      <div className="question-list-header">
        <h2>
          <span className="domain-title">{selectedDomain}</span>
          <span className="question-count">({filteredQuestions.length} Questions)</span>
        </h2>
        
        <div className="question-list-controls">
          <div className="search-wrapper">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search questions, answers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="questions-grid">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((item, index) => (
            <div key={index} className="question-card" data-aos="fade-up">
              <div className="question-card-header">
                <div className="question-meta">
                  <span className="question-number">Q{index + 1}</span>
                  {item.expected && (
                    <div className="confidence-meter">
                      <FaCheckCircle className="confidence-icon" />
                      <span>{item.expected.length} Key Points</span>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="question-title">
                {highlightSearchText(item.text, searchTerm)}
              </h3>
              
              <div className="question-content">
                <div className="answer-section">
                  <p>{highlightSearchText(item.answer, searchTerm)}</p>
                </div>
                
                {item.expected && (
                  <div className="keywords-section">
                    <h4>Key Concepts:</h4>
                    <div className="keyword-tags">
                      {item.expected.map((keyword, kidx) => (
                        <span 
                          key={kidx} 
                          className={`keyword-tag ${
                            searchTerm && keyword.toLowerCase().includes(searchTerm.toLowerCase()) 
                              ? 'highlight' 
                              : ''
                          }`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-questions-found">
            <div className="no-results-icon">🔍</div>
            <p>No questions found matching "{searchTerm}"</p>
            <button 
              className="clear-search-button"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
