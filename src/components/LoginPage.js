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
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://interviewxpertbackend.netlify.app/.netlify/functions/api'
        : 'http://localhost:3001/api';

      console.log('Attempting login with URL:', `${baseUrl}/login`);

      const response = await axios({
        method: 'post',
        url: `${baseUrl}/login`,
        data: {
          usernameOrEmail,
          password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      console.log('Response:', response);

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Login failed');
      }

      const { data } = response;
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userUsername', data.user.username);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('registrationDate', data.user.registrationDate);
      localStorage.setItem('isLoggedIn', 'true');

      setIsLoggedIn(true);
      navigate("/select-domain");
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to connect to the server. Please try again.'
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
