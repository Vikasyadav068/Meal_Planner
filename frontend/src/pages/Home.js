import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to TasteTrail</h1>
          <p>Discover amazing recipes, plan your meals, and simplify your cooking journey</p>
          
          {currentUser ? (
            <div className="hero-actions">
              <Link to="/recipes" className="cta-button primary">
                Browse Recipes
              </Link>
              <Link to="/meal-planner" className="cta-button secondary">
                Plan Your Meals
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/recipes" className="cta-button secondary">
                Browse Recipes
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🍳 Smart Recipe Discovery</h3>
              <p>Find recipes based on your dietary preferences, ingredients, and prep time</p>
            </div>
            <div className="feature-card">
              <h3>📅 Meal Planning</h3>
              <p>Drag and drop recipes to create your weekly meal plan</p>
            </div>
            <div className="feature-card">
              <h3>🛒 Auto Shopping Lists</h3>
              <p>Generate organized shopping lists from your meal plans</p>
            </div>
            <div className="feature-card">
              <h3>⭐ Reviews & Ratings</h3>
              <p>Share photos and reviews of your cooking creations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
