import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          TasteTrail
        </Link>
        
        <div className="navbar-menu">
          <Link to="/recipes" className="navbar-item">
            Recipes
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/meal-planner" className="navbar-item">
                Meal Planner
              </Link>
              <Link to="/shopping-list" className="navbar-item">
                Shopping List
              </Link>
              <Link to="/profile" className="navbar-item">
                Profile
              </Link>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/register" className="navbar-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
