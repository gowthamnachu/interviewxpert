import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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

    // Password validation checks
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!Object.values(requirements).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = 'https://interviewxpertbackend.netlify.app/.netlify/functions/api/register';
      console.log('Registering with:', apiUrl);
      
      const response = await axios({
        method: 'POST',
        url: apiUrl,
        data: {
          username,
          email,
          password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://interviewxpert.netlify.app'
        },
        validateStatus: (status) => status < 500
      });

      console.log('Registration response:', response.data);

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage(response.data.message || "Account created successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }

    } catch (err) {
      console.error('Registration error:', err.response || err);
      setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
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
