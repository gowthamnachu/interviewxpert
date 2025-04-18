import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { config } from '../config';
import "./Auth.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('Attempting login with URL:', `${config.apiUrl}/login`);
      const response = await axios({
        method: 'post',
        url: `${config.apiUrl}/login`,
        data: {
          usernameOrEmail,
          password
        },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const { token, user } = response.data;
      
      // Store token with expiration time (24 hours from now)
      const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiresAt.toString());
      localStorage.setItem('userUsername', user.username);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('registrationDate', user.registrationDate);
      localStorage.setItem('isLoggedIn', 'true');

      setIsLoggedIn(true);
      navigate("/select-domain");
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (!err.response) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/register")}>Create Account</span></p>
    </div>
  );
};

export default LoginPage;
