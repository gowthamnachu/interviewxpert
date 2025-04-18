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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log('Attempting login with credentials:', { usernameOrEmail });
      const apiUrl = `${config.apiUrl}/login`;

      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: {
          usernameOrEmail,
          password,
          loginMethod: 'password'
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Server response:', response.data);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userUsername', user.username);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('registrationDate', user.registrationDate);
      localStorage.setItem('isLoggedIn', 'true');

      setIsLoggedIn(true);
      navigate("/select-domain");
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(err.response?.data?.error || 'Unable to connect to server. Please try again.');
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
