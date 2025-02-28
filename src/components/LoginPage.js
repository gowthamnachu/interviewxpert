import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Get user credentials from localStorage
    const storedUsername = localStorage.getItem("userUsername");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    // Check if either username or email matches and password matches
    if ((usernameOrEmail === storedUsername || usernameOrEmail === storedEmail) && password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true"); // Save login state
      setIsLoggedIn(true);
      navigate("/select-domain"); // Redirect to DomainSelection page
    } else {
      setError("Invalid username/email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span></p>
    </div>
  );
};

export default LoginPage;
