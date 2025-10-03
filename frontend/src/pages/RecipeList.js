import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    diet: '',
    cuisine: '',
    prepTime: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(`http://localhost:5001/api/recipes?${queryParams}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipe-list-page">
      <div className="container">
        <h1>Discover Recipes</h1>
        
        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          
          <select
            name="diet"
            value={filters.diet}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
          
          <select
            name="cuisine"
            value={filters.cuisine}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Chinese">Chinese</option>
            <option value="Thai">Thai</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
          
          <select
            name="prepTime"
            value={filters.prepTime}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Any Prep Time</option>
            <option value="15">Under 15 mins</option>
            <option value="30">Under 30 mins</option>
            <option value="60">Under 1 hour</option>
          </select>
        </div>
        
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <h3>{recipe.title || recipe.name}</h3>
              <p className="recipe-meta">
                <span>🕒 {recipe.prepTime} mins</span>
                <span>🍽️ {recipe.cuisine}</span>
                <span>🥗 {recipe.diet || recipe.dietType}</span>
              </p>
              <p className="recipe-preview">
                {Array.isArray(recipe.instructions) 
                  ? recipe.instructions[0]?.substring(0, 100) + '...'
                  : recipe.instructions?.substring(0, 100) + '...'
                }
              </p>
              <Link to={`/recipes/${recipe._id}`} className="recipe-link">
                View Recipe
              </Link>
            </div>
          ))}
        </div>
        
        {recipes.length === 0 && (
          <div className="no-recipes">
            <h3>No recipes found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
