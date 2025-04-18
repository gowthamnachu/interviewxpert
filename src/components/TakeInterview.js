import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Bar, Pie, Radar } from "react-chartjs-2";
import "chart.js/auto"; // Required for Chart.js
import "./TakeInterview.css"; // Import the CSS file
import LoadingSpinner from "./LoadingSpinner";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import config from '../config';

const TakeInterview = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]); // Time taken to answer
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [fluencyScore, setFluencyScore] = useState(0);
  const [technicalAccuracy, setTechnicalAccuracy] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [hesitationCount, setHesitationCount] = useState(0);

  const startTimeRef = useRef(null);

  const generateSuggestions = useCallback((accuracy, fluencyScore, avgResponseTime) => {
    let feedback = "";
  
    // Technical Accuracy Analysis
    const technicalScore = Math.min(100, accuracy + (score * 20));
    setTechnicalAccuracy(technicalScore);
    if (technicalScore >= 90) {
      feedback += "🌟 Outstanding technical knowledge!\n";
    } else if (technicalScore >= 70) {
      feedback += "💫 Strong technical proficiency!\n";
    } else {
      feedback += "📚 Focus on strengthening core concepts.\n";
    }
  
    // Communication Skills Analysis
    const communicationScore = Math.min(100, fluencyScore + (100 - hesitationCount * 10));
    setCommunicationScore(communicationScore);
    
    return feedback;
  }, [score, hesitationCount, setTechnicalAccuracy, setCommunicationScore]);

  useEffect(() => {
    if (listening && !isPaused) {
      startTimeRef.current = Date.now();
    }
  }, [listening, isPaused]);

  useEffect(() => {
    if (questionIndex >= questions.length && interviewStarted) {
      const avgResponseTime = responseTimes.length ? 
        Math.round(responseTimes.reduce((a, b) => a + b) / responseTimes.length) : 0;
      setAccuracy(Math.round((score / 5) * 100));
      setConfidenceLevel(Math.round((score / 5) * 100));
      setFluencyScore(Math.max(0, 100 - hesitationCount * 5));
      setSuggestions(generateSuggestions(accuracy, fluencyScore, avgResponseTime));
      speak('Interview completed. Your final score is ' + score + ' out of 5.');
    }
  }, [
    questionIndex, 
    questions.length, 
    interviewStarted,
    generateSuggestions,
    score,
    accuracy,
    fluencyScore,
    responseTimes,
    hesitationCount
  ]);

  const domains = [
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
  ];

  const fetchQuestions = async (domain) => {
    try {
      setError(""); 
      const response = await axios.get(`${config.apiUrl}/questions?domain=${encodeURIComponent(domain)}`);
      if (!response.data || response.data.length === 0) {
        setError(`No questions found for ${domain}. Please try another domain.`);
        setLoading(false);
        return;
      }
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching questions:", error);
      setError("Failed to load questions. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setLoading(true);
    fetchQuestions(domain);
  };

  const startInterview = () => {
    if (selectedDomain) {
      setInterviewStarted(true);
    }
  };

  useEffect(() => {
    if (interviewStarted && questions.length > 0 && questionIndex < questions.length) {
      speak(questions[questionIndex].text);
    } else if (questionIndex >= 5) {
      setShowScore(true);
    }
  }, [questionIndex, interviewStarted, questions]);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
  };

  const [voiceActivity, setVoiceActivity] = useState(false);
  const [speechScript, setSpeechScript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(0);

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (listening && recognition) {
      recognition.stop();
      setListening(false);
    }
    speak(isPaused ? "Interview resumed" : "Interview paused");
  };

  const startListening = () => {
    if (isPaused) return;
    if (listening) {
      recognition && recognition.stop();
      setListening(false);
      return;
    }

    setListening(true);
    const newRecognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    setRecognition(newRecognition);
    
    newRecognition.lang = "en-US";
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.maxAlternatives = 3;

    // Create audio context for voice analysis
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVoiceActivity = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVoiceActivity(average > 30);
          setPitch(average);
          setVolume(Math.round((average / 255) * 100));
          if (!showScore) requestAnimationFrame(checkVoiceActivity);
        };

        checkVoiceActivity();
      })
      .catch(err => console.error('Error accessing microphone:', err));

    newRecognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          // Check for skip commands
          if (transcript.includes('i don\'t know') || 
              transcript.includes('next') || 
              transcript.includes('skip') || 
              transcript.includes('pass')) {
            skipQuestion();
            newRecognition.stop();
            setListening(false);
            return;
          }
          checkAnswer(transcript);
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimTranscript(interimTranscript);
      if (finalTranscript) {
        setSpeechScript(prevScript => prevScript + '\n' + finalTranscript);
      }
    };

    newRecognition.onspeechstart = () => {
      startTimeRef.current = Date.now();
      setVoiceActivity(true);
    };

    newRecognition.onspeechend = () => {
      const responseTime = (Date.now() - startTimeRef.current) / 1000;
      setResponseTimes([...responseTimes, responseTime]);
      setVoiceActivity(false);
    };

    newRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setFeedback("Couldn't recognize. Try again.");
      setListening(false);
    };

    newRecognition.onend = () => {
      setListening(false);
    };

    newRecognition.start();
  };

  const checkAnswer = (response) => {
    if (questions.length === 0) return;

    const currentQuestion = questions[questionIndex];
    const expectedKeywords = currentQuestion.expected;

    // Check if any keyword matches in the response
    const hasMatchedKeyword = expectedKeywords.some(word => 
      response.toLowerCase().includes(word.toLowerCase())
    );
    
    // Update hesitation count based on response analysis
    const hesitations = (response.match(/um|uh|er|ah/gi) || []).length;
    setHesitationCount(prevCount => prevCount + hesitations);

    // Update score and feedback
    if (hasMatchedKeyword) {
      setScore(prevScore => prevScore + 1);
      setFeedback("✅ Correct! Your answer contains the expected keywords.");
    } else {
      setFeedback("❌ Try again. Your answer doesn't contain any of the expected keywords.");
    }

    // Move to next question after a short delay to allow feedback to be visible
    setTimeout(() => {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setFeedback(""); // Clear feedback for next question
    }, 1500);
  };

  const chartData = {
    labels: [
      "Technical Accuracy",
      "Communication Score",
      "Speech Clarity",
      "Confidence Level",
      "Response Quality",
      "Fluency"
    ],
    datasets: [{
      label: "Performance Metrics",
      data: [
        technicalAccuracy,
        communicationScore,
        confidenceLevel,
        accuracy,
        fluencyScore
      ],
      backgroundColor: [
        "#2ecc71", // Technical Accuracy
        "#3498db", // Communication Score
        "#f1c40f", // Confidence Level
        "#e67e22", // Response Quality
        "#1abc9c"  // Fluency
      ]
    }]
  };

  const skipQuestion = () => {
    setFeedback("Skipping to next question...");
    speak("Moving to next question");
    setTimeout(() => {
      setFeedback("");
      setQuestionIndex(questionIndex + 1);
    }, 1500);
  };

  if (loading && selectedDomain) return <LoadingSpinner message="Loading questions" />;

  return (
    <div className="interview-container">
      <h2>AI-Powered Interview</h2>

      {!interviewStarted ? (
        <div className="interview-section start-section">
          <h2>Welcome to Your AI Interview Session</h2>
          <p className="intro-text">This advanced interview will be conducted via voice interaction. Our AI interviewer will ask questions, and you can respond naturally as you would in a real interview.</p>
          <div className="domain-selection">
            <h3>Select Your Interview Domain</h3>
            <select
              className="domain-dropdown"
              value={selectedDomain}
              onChange={(e) => handleDomainSelect(e.target.value)}
              disabled={loading}
            >
              <option value="">Choose a domain...</option>
              {domains.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <p>Real-time voice analysis</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <p>Comprehensive performance metrics</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <p>Professional feedback</p>
            </div>
          </div>
          <button 
            onClick={startInterview}
            disabled={loading || !selectedDomain || questions.length === 0}
          >
            {loading ? "Loading..." : "Begin Interview"}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      ) : !showScore ? (
        <div className="interview-section">
          <div className="interview-header">
            <div className="progress-indicator">
              <span>Question {questionIndex + 1} of {questions.length}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="question-container">
            <div className="interview-question">
              <strong>Interviewer:</strong> {questions[questionIndex]?.text}
            </div>
            {feedback && (
              <div className="feedback-container">
                <p className="feedback-text">{feedback}</p>
                <div className="expected-answer">
                  <h4>Expected Answer:</h4>
                  <p>{questions[questionIndex]?.answer}</p>
                </div>
              </div>
            )}
            <div className="button-group">
              <button 
                className={`answer-button ${listening ? 'listening' : ''}`}
                onClick={startListening} 
                disabled={listening || isPaused}
              >
                {listening ? (
                  <>
                    <div className="listening-indicator"></div>
                    <span>Listening to your response...</span>
                  </>
                ) : (
                  <span>Click to Answer</span>
                )}
              </button>
              <button 
                className={`pause-button ${isPaused ? 'paused' : ''}`}
                onClick={handlePause}
              >
                {isPaused ? 'Resume Interview' : 'Pause Interview'}
              </button>
              <button 
                className="skip-button"
                onClick={skipQuestion}
                disabled={listening || isPaused}
              >
                Skip Question
              </button>
            </div>
          </div>

          <div className="metrics-container">
            <div className="voice-metrics">
              <div className="metric-card">
                <div className={`voice-activity-indicator ${voiceActivity ? 'active' : 'inactive'}`}></div>
                <span className="metric-label">Voice Activity</span>
                <div className="metric-value">{voiceActivity ? "Speaking" : "Silent"}</div>
              </div>
              <div className="metric-card">
                <span className="metric-label">Volume Level</span>
                <div className="metric-value">{volume}%</div>
              </div>
              <div className="metric-card">
                <span className="metric-label">Pitch Analysis</span>
                <div className="metric-value">{pitch}</div>
              </div>
            </div>
          </div>

          <div className="speech-analysis-container">
            <h4>Speech Analysis</h4>
            <div className="transcript-content">
              <p className="current-speech">{interimTranscript}</p>
              <div className="speech-history">
                <pre>{speechScript}</pre>
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`feedback-container feedback-message ${feedback.includes("✅") ? 'success' : 'error'}`}>
              {feedback}
            </div>
          )}
        </div>
      ) : (
        <div className="results-container">
          <h3>Interview Performance Analysis</h3>
          
          <div className="score-overview">
            <div className="score-card">
              <h4>Overall Score</h4>
              <div className="score-value">{score} / 5</div>
            </div>
            <div className="score-card">
              <h4>Accuracy Rate</h4>
              <div className="score-value">{accuracy}%</div>
            </div>
            <div className="score-card">
              <h4>Fluency Rating</h4>
              <div className="score-value">{fluencyScore}%</div>
            </div>
          </div>

          <div className="interview-analysis">
            <h4>Technical Assessment Analysis</h4>
            {questions.map((question, index) => (
              <div key={index} className="question-analysis-card">
                <div className="question-header">
                  <div className="question-title">
                    <span className="question-circle">{index + 1}</span>
                    <span className="question-label">Question</span>
                  </div>
                  <div className="response-status">
                    {speechScript.split('\n')[index] ? 
                      <span className="attempted"><FaCheckCircle /> Attempted</span> : 
                      <span className="not-attempted"><FaTimesCircle /> Not Attempted</span>
                    }
                  </div>
                </div>

                <div className="question-content">
                  <div className="analysis-section">
                    <h5>Question:</h5>
                    <p>{question.text}</p>
                  </div>

                  <div className="analysis-section">
                    <h5>Your Response:</h5>
                    <p className={`response ${!speechScript.split('\n')[index] ? 'no-response' : ''}`}>
                      {speechScript.split('\n')[index] || 'No response provided'}
                    </p>
                  </div>

                  <div className="analysis-section">
                    <h5>Model Answer:</h5>
                    <p>{question.answer}</p>
                  </div>

                  <div className="analysis-section">
                    <h5>Key Concepts:</h5>
                    <div className="keyword-tags">
                      {question.expected.map((keyword, kidx) => (
                        <span key={kidx} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <div className="chart-wrapper">
              <h4>Performance Metrics</h4>
              <Bar data={chartData} />
            </div>
            <div className="chart-wrapper">
              <h4>Skill Analysis</h4>
              <Radar data={chartData} />
            </div>
            <div className="chart-wrapper">
              <h4>Overall Distribution</h4>
              <Pie data={chartData} />
            </div>
          </div>

          <div className="suggestions-section">
            <h4>Professional Feedback & Recommendations</h4>
            <div className="suggestions-content">{suggestions}</div>
          </div>

          <button className="retry-button" onClick={() => window.location.reload()}>Start New Interview</button>
        </div>
      )}
    </div>
  );
};

export default TakeInterview;
