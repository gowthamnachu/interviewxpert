import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Certificate from "./Certificate";
import apiService from '../utils/apiService';
import "./MockTest.css";

const MockTest = () => {
  const location = useLocation();
  const [selectedDomain, setSelectedDomain] = useState(location.state?.domain || "Software Engineering");
  const [domains] = useState([
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Marketing',
    'Cloud Computing',
    'Frontend Development',
    'Database Management',
    'Network Engineering',
    'Cybersecurity',
    'Mobile Development',
    'Artificial Intelligence',
    'Game Development',
    'Backend Development',
    'Machine Learning',
    'DevOps Engineering',
    'System Administration',
    'Business Analytics',
    'QA Engineering',
    'Embedded Systems',
    'Web Development'
  ]);
  
  const [questions, setQuestions] = useState([]); // Initialize as empty array
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [analytics, setAnalytics] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    timePerQuestion: []
  });
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState(null);

  const calculateAnalytics = useCallback(() => {
    const correct = Object.entries(selectedAnswers).filter(
      ([index, answer]) => answer === questions[index]?.correctOption
    ).length;
    
    const incorrect = Object.entries(selectedAnswers).filter(
      ([index, answer]) => answer !== questions[index]?.correctOption
    ).length;
    
    const unanswered = questions.length - Object.keys(selectedAnswers).length;
    
    const timePerQuestion = analytics.timePerQuestion || new Array(questions.length).fill(0);
    
    return {
      correct,
      incorrect,
      unanswered,
      timePerQuestion,
      totalQuestions: questions.length
    };
  }, [questions, selectedAnswers, analytics.timePerQuestion]);

  const handleNextQuestion = useCallback(() => {
    // Update time taken for current question
    setAnalytics(prev => ({
      ...prev,
      timePerQuestion: prev.timePerQuestion.map((time, idx) => 
        idx === currentQuestionIndex ? 60 - timeLeft : time
      )
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      const finalAnalytics = calculateAnalytics();
      setAnalytics(finalAnalytics);
      setShowResults(true);
    }
  }, [currentQuestionIndex, questions.length, timeLeft, calculateAnalytics]);

  const fetchMockQuestions = async () => {
    try {
      const response = await apiService.getMockQuestions(selectedDomain);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching mock questions:', error);
      setError('Failed to fetch questions');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiService.submitMockTest({
        domain: selectedDomain,
        answers: selectedAnswers,
        score: analytics.correct
      });
      // Handle certificate generation
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  useEffect(() => {
    fetchMockQuestions();
  }, [selectedDomain]);

  useEffect(() => {
    if (testStarted && !showResults && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleNextQuestion();
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, showResults, testStarted, handleNextQuestion]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(60);
    setAnalytics({
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      timePerQuestion: new Array(questions.length).fill(0),
      totalQuestions: questions.length
    });
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setTimeLeft(60);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setShowNameInput(false);
  };

  if (loading || !questions || questions.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FaSpinner className="spin" size="3x" />
        </div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="test-intro-container">
        <h2><FaCheckCircle /> Mock Test</h2>
        <div className="domain-select">
          <select 
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="domain-dropdown"
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <div className="test-instructions">
          <h3><FaTimesCircle /> Test Instructions</h3>
          <ul>
            <li><FaCheckCircle /> This test contains {questions?.length || 0} questions</li>
            <li><FaClock /> You have 60 seconds for each question</li>
            <li><FaTimesCircle /> You cannot return to previous questions</li>
            <li><FaCheckCircle /> Click Start Test when you're ready</li>
          </ul>
        </div>
        <div className="test-features">
          <div className="feature-item">
            <FaClock className="feature-icon" />
            <h4>Timed Questions</h4>
            <p>Each question has a 60-second timer</p>
          </div>
          <div className="feature-item">
            <FaCheckCircle className="feature-icon" />
            <h4>Detailed Analytics</h4>
            <p>Get comprehensive performance insights</p>
          </div>
        </div>
        <button className="start-test-btn pulse-animation" onClick={startTest}>
          <FaCheckCircle /> Start Test
        </button>
      </div>
    );
  }

  if (testStarted && !showResults) {
    return (
      <div className="mock-test-container">
        <div className="main-content">
          <div className="sidebar-trigger">
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-header">
              <h3>{selectedDomain}</h3>
            </div>
            <div className="sidebar-content">
              <div className="questions-list">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`question-item ${index === currentQuestionIndex ? 'active' : ''} 
                              ${selectedAnswers[index] !== undefined ? 'answered' : ''}`}
                    onClick={() => navigateToQuestion(index)}
                  >
                    Question {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {questions[currentQuestionIndex] && (
            <div className="question-container">
              <div className="timer">
                <div 
                  className="timer-fill" 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
                <span className="timer-text">
                  <FaClock /> {timeLeft}s
                </span>
              </div>

              <h3 className="question-text">{questions[currentQuestionIndex].text}</h3>

              <div className="options-list">
                {questions[currentQuestionIndex].options?.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button className="next-button" onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    <FaCheckCircle /> Finish Test
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Next Question
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    if (!userName && !showNameInput) {
      setShowNameInput(true);
    }

    if (showNameInput) {
      return (
        <div className="name-input-container">
          <h2>Congratulations on completing the test!</h2>
          <p>Please enter your full name to view your results and generate your certificate.</p>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="name-input"
            />
            <button type="submit" className="submit-name-btn">
              View Results
            </button>
          </form>
        </div>
      );
    }

    const percentage = ((analytics.correct / questions.length) * 100).toFixed(2);
    const averageTime = analytics.timePerQuestion.length 
      ? (analytics.timePerQuestion.reduce((a, b) => a + b, 0) / analytics.timePerQuestion.length).toFixed(1)
      : 0;
    const performanceLevel = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Needs Improvement';

    return (
      <div className="results-container">
        <h2>Mock Test Results</h2>
        
        <div className="score-summary">
          <div className="score-circle" style={{ 
            background: `conic-gradient(#4CAF50 ${percentage}%, #f0f0f0 0)`
          }}>
            <div className="score-number">{percentage}%</div>
            <div className="score-label">Final Score</div>
            <div className="performance-level">{performanceLevel}</div>
          </div>
          
          <div className="score-details">
            <div className="score-item">
              <span className="label"><FaCheckCircle /> Correct Answers:</span>
              <span className="value correct">{analytics?.correct || 0}</span>
              <div className="percentage">
                ({questions?.length ? ((analytics?.correct || 0)/questions.length * 100).toFixed(1) : 0}%)
              </div>
            </div>
            <div className="score-item">
              <span className="label"><FaTimesCircle /> Incorrect Answers:</span>
              <span className="value incorrect">{analytics?.incorrect || 0}</span>
              <div className="percentage">
                ({questions?.length ? ((analytics?.incorrect || 0)/questions.length * 100).toFixed(1) : 0}%)
              </div>
            </div>
            <div className="score-item">
              <span className="label"><FaCheckCircle /> Unanswered:</span>
              <span className="value unanswered">{analytics?.unanswered || 0}</span>
              <div className="percentage">
                ({questions?.length ? ((analytics?.unanswered || 0)/questions.length * 100).toFixed(1) : 0}%)
              </div>
            </div>
            <div className="score-item">
              <span className="label"><FaClock /> Average Time per Question:</span>
              <span className="value">{averageTime}s</span>
            </div>
          </div>
        </div>

        <div className="performance-summary">
          <h3>Performance Summary</h3>
          <div className="performance-metrics">
            <div className="metric">
              <h4>
                <FaClock className="icon" />
                Time Management
              </h4>
              <p>{averageTime < 30 ? 'Quick responses - Good time management!' : 
                  averageTime < 45 ? 'Moderate pace - Decent time management' : 
                  'Slower responses - Consider improving time management'}</p>
            </div>
            <div className="metric">
              <h4>
                <FaCheckCircle className="icon" />
                Accuracy Rate
              </h4>
              <p>{questions?.length ? ((analytics?.correct || 0)/questions.length * 100).toFixed(1) : 0}% accuracy - 
                 {percentage >= 80 ? 'Excellent command of the subject!' : 
                  percentage >= 60 ? 'Good understanding, room for improvement' : 
                  'Consider reviewing the subject material'}</p>
            </div>
            <div className="metric">
              <h4>
                <FaCheckCircle className="icon" />
                Performance Level
              </h4>
              <p>{performanceLevel} - {percentage >= 80 ? 'Keep up the excellent work!' :
                  percentage >= 60 ? 'You\'re doing well, but there\'s room for growth' :
                  percentage >= 40 ? 'Focus on improving your understanding' :
                  'Consider additional study and practice'}</p>
            </div>
            <div className="metric">
              <h4>
                <FaCheckCircle className="icon" />
                Question Analysis
              </h4>
              <p>Attempted {questions?.length ? questions.length - (analytics?.unanswered || 0) : 0} out of {questions?.length || 0} questions.
                 {analytics?.unanswered > 0 ? ` Work on time management to attempt all questions.` : ` Great job attempting all questions!`}</p>
            </div>
          </div>
        </div>

        <div className="detailed-review">
          <h3>Detailed Review</h3>
          <div className="review-questions">
            {questions.map((question, index) => (
              <div key={index} className="review-question-box">
                <div className="review-header">
                  <span className="question-number">Question {index + 1}</span>
                  {selectedAnswers[index] === question.correctOption ? (
                    <FaCheckCircle className="correct-icon" />
                  ) : (
                    <FaTimesCircle className="incorrect-icon" />
                  )}
                </div>
                <div className="review-content">
                  <p className="question-text">{question.text}</p>
                  <p className="selected-answer">
                    Your Answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                  </p>
                  <p className="correct-answer">
                    Correct Answer: {question.options[question.correctOption]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {percentage < 60 && (
              <li>Consider reviewing the fundamental concepts of {selectedDomain}</li>
            )}
            {analytics?.unanswered > 0 && (
              <li>Work on time management to ensure all questions are attempted</li>
            )}
            {averageTime > 45 && (
              <li>Practice more mock tests to improve response time</li>
            )}
            {analytics?.incorrect > analytics?.correct && (
              <li>Focus on understanding core concepts rather than rushing through questions</li>
            )}
          </ul>
        </div>

        <Certificate
          userName={userName}
          domain={selectedDomain}
          score={percentage}
          date={new Date().toLocaleDateString()}
        />
      </div>
    );
  }

  return (
    <div className="mock-test-container">
      <div className="main-content">
        <div className="sidebar-trigger">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">
            <h3>{selectedDomain}</h3>
          </div>
          <div className="sidebar-content">
            <div className="questions-list">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`question-item ${index === currentQuestionIndex ? 'active' : ''} 
                            ${selectedAnswers[index] !== undefined ? 'answered' : ''}`}
                  onClick={() => navigateToQuestion(index)}
                >
                  Question {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {questions[currentQuestionIndex] && (
          <div className="question-container">
            <div className="timer">
              <div 
                className="timer-fill" 
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
              <span className="timer-text">
                <FaClock /> {timeLeft}s
              </span>
            </div>

            <h3 className="question-text">{questions[currentQuestionIndex]?.text}</h3>

            <div className="options-list">
              {questions[currentQuestionIndex]?.options?.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>

            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestionIndex === questions.length - 1 ? (
                <>
                  <FaCheckCircle /> Finish Test
                </>
              ) : (
                <>
                  <FaCheckCircle /> Next Question
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;