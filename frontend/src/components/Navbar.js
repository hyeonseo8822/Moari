import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ currentUser, logout }) {
  return (
    <nav>
      <h1><Link to="/">Moari</Link></h1>
      <div className="nav-links">
        {currentUser ? (
          <>
            <Link to="/mypage" className="nav-link">My Page</Link>
            <Link to="/register" className="nav-link">Register Club</Link>
            <button onClick={logout} className="nav-link logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
