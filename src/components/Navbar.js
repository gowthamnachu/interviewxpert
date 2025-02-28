import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">InterviewXpert</Link>
      </div>
      <div className="links">
        <Link to="/select-domain">Prepare</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/take-interview">Take Interview</Link>
            <Link to="/build-resume">Build Resume</Link> {/* Added Build Resume Link */}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
