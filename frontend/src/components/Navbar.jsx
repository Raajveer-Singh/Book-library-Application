import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <Link to="/">📚 Book Library</Link>
        </div>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/">Browse Books</Link>

                {/* Show user-specific links only for regular users */}
              {user && user.role === 'user' && (
            <>
              <Link to="/my-books">My Books</Link>
              <Link to="/history">History</Link>
            </>
               )} 
              
              {user.role === 'admin' && (
                <Link to="/books/add">Add Book</Link>
              )}
              
              <div className="user-info">
                <span>Welcome, {user.username} ({user.role})</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;