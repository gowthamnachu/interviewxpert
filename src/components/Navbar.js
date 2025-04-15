import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">InterviewXpert</Link>
      </div>
      <div className="links">
        {isLoggedIn ? (
          <>
            <Link to="/select-domain">Prepare</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/take-interview">Take Interview</Link>
            <Link to="/mock-test">Mock Test</Link>
            <Link to="/build-resume">Build Resume</Link>
            <Link to="/expert-ai">Expert AI</Link>
            <Link to="/verify-certificate">Verify Certificate</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/verify-certificate">Verify Certificate</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
