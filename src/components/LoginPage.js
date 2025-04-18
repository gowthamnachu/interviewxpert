import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Auth.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Always use the Netlify function URL in production
      const apiUrl = 'https://interviewxpertbackend.netlify.app/.netlify/functions/api/login';
      console.log('Login attempt:', { url: apiUrl, username: usernameOrEmail });

      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: {
          username: usernameOrEmail, // Changed to match backend expectation
          email: usernameOrEmail,    // Send both for flexibility
          password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://interviewxpert.netlify.app'
        },
        timeout: 10000, // 10 second timeout
        withCredentials: true
      });

      console.log('Raw server response:', response);

      // Handle non-200 responses
      if (response.status !== 200 || !response.data) {
        console.error('Server response:', response);
        throw new Error(response.data?.error || 'Invalid server response');
      }

      // Safely access response data
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userUsername', user.username || '');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('registrationDate', user.registrationDate || '');
      localStorage.setItem('isLoggedIn', 'true');

      setIsLoggedIn(true);
      navigate("/select-domain");
    } catch (err) {
      console.error('Login failed:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Unable to connect to server. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="usernameOrEmail">Username or Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit">Sign In</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/register")}>Create Account</span></p>
    </div>
  );
};

export default LoginPage;
