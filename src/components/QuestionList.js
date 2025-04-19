import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import './QuestionList.css';
import { AdvancedLoading } from './LoadingAnimation';

const QuestionList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const selectedDomain = location.state?.domain || "Software Engineering";
  const [currentLoadingStage, setCurrentLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedDomain) {
        navigate('/select-domain');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching questions for domain:', selectedDomain);
        console.log('API URL:', `${config.apiUrl}/questions?domain=${encodeURIComponent(selectedDomain)}`);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios({
          method: 'get',
          url: `${config.apiUrl}/questions?domain=${encodeURIComponent(selectedDomain)}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        console.log('Questions API response:', response.data);
        
        if (!response.data || response.data.length === 0) {
          setError(`No questions found for ${selectedDomain}`);
          setQuestions([]);
        } else {
          setQuestions(response.data);
        }
      } catch (err) {
        console.error('Error fetching questions:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config
        });
        
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        setError(err.response?.data?.error || 
                'Failed to load questions. Please try again later.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedDomain, navigate]);

  useEffect(() => {
    if (loading) {
      const stageInterval = setInterval(() => {
        setCurrentLoadingStage(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(stageInterval);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + 1));
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [loading]);

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
    return (
      <div className="question-list-loading">
        <AdvancedLoading 
          progress={progress}
          currentStage={currentLoadingStage}
          stages={[
            {
              title: "Initializing System",
              description: "Setting up question bank environment",
              icon: "🔄"
            },
            {
              title: `Loading ${selectedDomain} Questions`,
              description: "Fetching specialized questions from database",
              icon: "📚"
            },
            {
              title: "Processing Content",
              description: "Analyzing and organizing interview materials",
              icon: "⚙️"
            },
            {
              title: "Final Preparations",
              description: "Setting up interactive interface",
              icon: "✨"
            }
          ]}
        />
      </div>
    );
  }

  if (!selectedDomain) {
    return null;
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
        {loading ? (
          <div className="question-list-loader">
            <div className="loader-spinner"></div>
            <p>Loading questions...</p>
          </div>
        ) : error ? (
          <div className="question-list-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
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
      <button 
        className="back-button"
        onClick={() => navigate('/select-domain')}
      >
        Back to Domain Selection
      </button>
    </div>
  );
};

export default QuestionList;
