import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Radar } from "react-chartjs-2";
import "chart.js/auto"; // Required for Chart.js

const TakeInterview = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]); // Time taken to answer
  const [hesitationCount, setHesitationCount] = useState(0); // Pauses detected
  const [fluencyScore, setFluencyScore] = useState(0); // Smoothness of speech
  const [completeness, setCompleteness] = useState(0); // How complete the answer is
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [suggestions, setSuggestions] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/questions")
      .then(response => {
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5)); // Limit to 5 questions
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Error fetching questions:", error);
        setError("Failed to load questions.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (interviewStarted && questions.length > 0 && questionIndex < questions.length) {
      speak(questions[questionIndex].text);
      startTime = Date.now(); // Start timing response
    } else if (questionIndex >= 5) {
      setShowScore(true);
      const avgResponseTime = responseTimes.length ? Math.round(responseTimes.reduce((a, b) => a + b) / responseTimes.length) : 0;
      setAccuracy(Math.round((score / 5) * 100));
      setConfidenceLevel(Math.round((score / 5) * 100));
      setFluencyScore(Math.max(0, 100 - hesitationCount * 5));
      setCompleteness(Math.round((score / 5) * 100));
      setSuggestions(generateSuggestions(accuracy, fluencyScore, avgResponseTime));
      speak(`Interview completed. Your final score is ${score} out of 5.`);
    }
  }, [questionIndex, interviewStarted, questions]);

  let startTime = 0;

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
  };

  const startListening = () => {
    setListening(true);
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      checkAnswer(transcript);
    };

    recognition.onspeechstart = () => {
      startTime = Date.now();
    };

    recognition.onspeechend = () => {
      const responseTime = (Date.now() - startTime) / 1000; // Response time in seconds
      setResponseTimes([...responseTimes, responseTime]);
    };

    recognition.onerror = () => {
      setFeedback("Couldn't recognize. Try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const checkAnswer = (response) => {
    if (questions.length === 0) return;

    const expectedKeywords = questions[questionIndex].expected;
    const matched = expectedKeywords.some((word) => response.includes(word));

    // Detect hesitation (pauses like "uh", "um", "hmm")
    const hesitationWords = ["uh", "um", "hmm", "like", "you know"];
    const hesitationMatches = hesitationWords.reduce((count, word) => count + (response.includes(word) ? 1 : 0), 0);
    setHesitationCount(hesitationCount + hesitationMatches);

    if (matched) {
      setScore(score + 1);
      setFeedback("✅ Good response!");
      speak("Good response! That was a strong answer.");
    } else {
      setFeedback("❌ Not quite right. Try to be more specific.");
      speak("Not quite right. Try to be more specific.");
    }

    setTimeout(() => {
      setFeedback("");
      setQuestionIndex(questionIndex + 1);
    }, 2000);
  };

  const generateSuggestions = (accuracy, fluencyScore, avgResponseTime) => {
    let feedback = "";

    if (accuracy === 100) {
      feedback += "Excellent accuracy! Keep practicing to maintain your performance.\n";
    } else if (accuracy >= 80) {
      feedback += "Great accuracy! Try to elaborate your answers for better impact.\n";
    } else {
      feedback += "Improve your responses by structuring them more effectively.\n";
    }

    if (fluencyScore < 60) {
      feedback += "Try to reduce hesitation and speak confidently.\n";
    }

    if (avgResponseTime > 5) {
      feedback += "Consider answering more promptly while maintaining clarity.\n";
    }

    return feedback;
  };

  // Visualization Data
  const chartData = {
    labels: ["Correct Answers", "Wrong Answers", "Confidence Level", "Accuracy", "Fluency"],
    datasets: [
      {
        label: "Performance",
        data: [score, 5 - score, confidenceLevel, accuracy, fluencyScore],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6610f2"],
      },
    ],
  };

  if (loading) return <p>Loading interview questions...</p>;
  if (error) return <p>{error}</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  return (
    <div className="interview-container">
      <h2>AI-Powered Interview</h2>

      {!interviewStarted ? (
        <div>
          <p>Welcome! This interview will be conducted via voice. You will hear questions, and you should respond naturally.</p>
          <button onClick={() => { setInterviewStarted(true); speak("Welcome! Let's begin the interview."); }}>Start Interview</button>
        </div>
      ) : !showScore ? (
        <div>
          <p><strong>Interviewer:</strong> {questions[questionIndex]?.text}</p>
          <button onClick={startListening} disabled={listening}>
            {listening ? "Listening..." : "Answer"}
          </button>
          <p>{feedback}</p>
        </div>
      ) : (
        <div>
          <h3>Interview Completed</h3>
          <p>Your Final Score: {score} / 5</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Fluency Score: {fluencyScore}%</p>
          <div className="chart-container">
            <Bar data={chartData} />
            <Radar data={chartData} />
            <Pie data={chartData} />
          </div>
          <h4>Suggestions:</h4>
          <p>{suggestions}</p>
          <button onClick={() => window.location.reload()}>Retry Interview</button>
        </div>
      )}
    </div>
  );
};

export default TakeInterview;
