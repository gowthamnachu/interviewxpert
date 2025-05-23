import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import DomainSelection from "./components/DomainSelection";
import QuestionList from "./components/QuestionList";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import ResumePage from "./components/ResumePage"; 
import Navbar from "./components/Navbar";
import TakeInterview from "./components/TakeInterview";
import Footer from "./components/Footer";
import IntroVideo from "./components/IntroVideo";
import XBot from "./components/XBot";
import ExpertAI from "./components/ExpertAI";
import MockTest from "./components/MockTest";
import VerifyCertificate from "./components/VerifyCertificate";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    // Hide the intro video after it finishes
    const timer = setTimeout(() => setShowIntro(false), 5000); // Adjust based on actual video length
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {showIntro ? (
        <IntroVideo />
      ) : (
        <>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/select-domain" element={isLoggedIn ? <DomainSelection /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/questions" element={isLoggedIn ? <QuestionList /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/build-resume" element={isLoggedIn ? <ResumePage /> : <Navigate to="/login" />} />
            <Route path="/take-interview" element={isLoggedIn ? <TakeInterview /> : <Navigate to="/login" />} />
            <Route path="/expert-ai" element={isLoggedIn ? <ExpertAI /> : <Navigate to="/login" />} />
            <Route path="/mock-test" element={isLoggedIn ? <MockTest /> : <Navigate to="/login" />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />
            <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
          </Routes>
          <Footer />
          <XBot />
        </>
      )}
    </Router>
  );
};

export default App;
