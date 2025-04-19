import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { config } from '../config';
import "./Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password) => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!Object.values(requirements).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);
    
    // Try both standard and Netlify function endpoints
    const standardEndpoint = `${config.apiUrl}/register`;
    const netlifyEndpoint = `${config.apiUrl}/register`;

    try {
      let response;
      try {
        // First try standard endpoint
        response = await axios({
          method: 'post',
          url: standardEndpoint,
          data: { username, email, password },
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });
      } catch (err) {
        if (err.response?.status === 404) {
          // If 404, try Netlify endpoint
          response = await axios({
            method: 'post',
            url: netlifyEndpoint,
            data: { username, email, password },
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
          });
        } else {
          throw err;
        }
      }

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        endpoints: { standardEndpoint, netlifyEndpoint }
      });
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.statusText ||
                          err.message ||
                          'Registration failed. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=" "
            required
            disabled={isLoading}
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
            disabled={isLoading}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="password-requirements">
          <div className={`requirement ${requirements.length ? 'met' : ''}`}>
            <i className={requirements.length ? '✓' : '○'} /> At least 8 characters
          </div>
          <div className={`requirement ${requirements.uppercase ? 'met' : ''}`}>
            <i className={requirements.uppercase ? '✓' : '○'} /> One uppercase letter
          </div>
          <div className={`requirement ${requirements.lowercase ? 'met' : ''}`}>
            <i className={requirements.lowercase ? '✓' : '○'} /> One lowercase letter
          </div>
          <div className={`requirement ${requirements.number ? 'met' : ''}`}>
            <i className={requirements.number ? '✓' : '○'} /> One number
          </div>
          <div className={`requirement ${requirements.special ? 'met' : ''}`}>
            <i className={requirements.special ? '✓' : '○'} /> One special character
          </div>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            required
            disabled={isLoading}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
      <p>Already have an account? <span onClick={() => navigate("/login")}>Sign In</span></p>
    </div>
  );
};

export default RegisterPage;
