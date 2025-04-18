import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from '../config';
import "./Auth.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Use direct URL in development, Netlify function URL in production
    const loginUrl = config.isDevelopment 
      ? 'http://localhost:3001/api/login'
      : `${config.apiBaseUrl}/login`;

    try {
      console.log('Attempting login at:', loginUrl); // Debug log
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          usernameOrEmail,
          password
        }),
      });

      // Add response validation
      if (!response.ok) {
        console.error('Response status:', response.status); // Debug log
        console.error('Response status text:', response.statusText); // Debug log
        if (response.status === 404) {
          throw new Error(`API endpoint not found at ${loginUrl}`);
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Login failed: ${response.statusText}`);
      }

      const data = await response.json().catch(() => {
        throw new Error('Invalid response from server');
      });

      if (!data || !data.token) {
        throw new Error('Invalid response format from server');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userUsername', data.user.username);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('registrationDate', data.user.registrationDate);
      localStorage.setItem('isLoggedIn', 'true');

      setIsLoggedIn(true);
      navigate("/select-domain");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connection failed. Please check your internet connection.');
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
