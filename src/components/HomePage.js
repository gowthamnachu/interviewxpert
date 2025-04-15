import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaGraduationCap, FaBrain, FaChartLine, FaCertificate, FaAward, FaPlay } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FaBrain />,
      title: "AI Interview Bot",
      description: "Practice with our intelligent chatbot for realistic interview scenarios"
    },
    {
      icon: <FaGraduationCap />,
      title: "Mock Tests",
      description: "Take timed assessments and earn verified certificates"
    },
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      description: "Track your progress with detailed interview performance metrics"
    },
    {
      icon: <FaCertificate />,
      title: "Verified Certificates",
      description: "Earn and showcase your interview preparation achievements"
    },
    {
      icon: <FaRocket />,
      title: "Expert AI Assistant",
      description: "Get instant help and guidance from our AI expert system"
    },
    {
      icon: <FaAward />,
      title: "Resume Builder",
      description: "Create and manage your professional resume"
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="tagline-wrapper">
            <h1 className="main-tagline">ACE YOUR INTERVIEW, WITH InterviewXpert</h1>
            <div className="tagline-underline"></div>
          </div>
          
          <p className="hero-description">
            Transform your interview preparation with AI-powered practice, 
            expert guidance, and real-time feedback
          </p>
          
          <div className="cta-group">
            <button className="primary-cta" onClick={() => navigate("/select-domain")}>
              Start Free Trial <FaPlay className="button-icon" />
            </button>
          </div>
        </div>
        
        <div className="stats-banner">
          <div className="stat-item animate-on-scroll">
            <span className="stat-number">20+</span>
            <span className="stat-label">Tech Domains</span>
          </div>
          <div className="stat-item animate-on-scroll">
            <span className="stat-number">100+</span>
            <span className="stat-label">Interview Questions</span>
          </div>
          <div className="stat-item animate-on-scroll">
            <span className="stat-number">24/7</span>
            <span className="stat-label">AI Support</span>
          </div>
        </div>
      </div>

      <div className="features-section animate-on-scroll">
        <h2>Why Choose InterviewXpert?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card animate-on-scroll">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="action-section animate-on-scroll">
        <div className="action-content">
          <h2>Ready to Transform Your Interview Preparation?</h2>
          <p>Join thousands of successful candidates who trusted InterviewXpert</p>
          <button className="primary-cta" onClick={() => navigate("/register")}>
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
