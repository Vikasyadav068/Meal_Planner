import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [servings, setServings] = useState(4);

  useEffect(() => {
    fetchRecipe();
    if (isAuthenticated) {
      fetchReviews();
      checkIfSaved();
    }
  }, [id, isAuthenticated]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
      if (response.data.success) {
        setRecipe(response.data.recipe);
        setServings(response.data.recipe.servings || 4);
      } else {
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/recipes/${id}/reviews`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/user/saved`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setIsSaved(response.data.savedRecipes.includes(id));
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const toggleSaveRecipe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = isSaved ? 'unsave' : 'save';
      const response = await axios.post(`http://localhost:5001/api/user/recipes/${endpoint}`, 
        { recipeId: id }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5001/api/recipes/${id}/reviews`, 
        { rating: userRating, comment: reviewText }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        setUserRating(0);
        setReviewText('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 400) {
        alert('You have already reviewed this recipe');
      }
    }
  };

  const addToMealPlan = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const mealPlans = JSON.parse(localStorage.getItem('mealPlans') || '{}');
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (!mealPlans[todayKey]) {
      mealPlans[todayKey] = [];
    }
    
    mealPlans[todayKey].push({
      id: recipe._id,
      name: recipe.name,
      image: recipe.image,
      prepTime: recipe.prepTime
    });
    
    localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
    alert('Recipe added to today\'s meal plan!');
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const adjustServings = (newServings) => {
    setServings(Math.max(1, newServings));
  };

  const getAdjustedIngredients = () => {
    if (!recipe || !recipe.ingredients) return [];
    const ratio = servings / (recipe.servings || 4);
    
    return recipe.ingredients.map(ingredient => {
      // Handle both string and object formats
      if (typeof ingredient === 'string') {
        // Parse string ingredient
        const parts = ingredient.match(/^(\d+(?:\/\d+)?)\s*(\w+)?\s*(.+)/) || [];
        const amount = parts[1] || '1';
        const unit = parts[2] || 'piece';
        const name = parts[3] || ingredient;
        
        const numericAmount = parseFloat(amount);
        if (!isNaN(numericAmount)) {
          const adjustedAmount = (numericAmount * ratio).toFixed(2).replace(/\.?0+$/, '');
          return {
            amount: adjustedAmount,
            unit: unit,
            name: name
          };
        }
        return { amount: amount, unit: unit, name: name };
      } else {
        // Handle object format
        const amount = parseFloat(ingredient.amount);
        if (!isNaN(amount)) {
          const adjustedAmount = (amount * ratio).toFixed(2).replace(/\.?0+$/, '');
          return {
            ...ingredient,
            amount: adjustedAmount
          };
        }
        return ingredient;
      }
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="recipe-detail loading">
        <div className="loading-spinner">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail error">
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')}>Back to Recipes</button>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="container">
        {/* Header Section */}
        <div className="recipe-header">
          <div className="recipe-image">
            <img src={recipe.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500'} 
                 alt={recipe.name || recipe.title || 'Recipe'} 
                 onError={(e) => {
                   e.target.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500';
                 }} />
            <div className="recipe-actions">
              <button 
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={toggleSaveRecipe}
              >
                {isSaved ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button className="meal-plan-btn" onClick={addToMealPlan}>
                📅 Add to Meal Plan
              </button>
            </div>
          </div>
          <div className="recipe-info">
            <h1>{recipe.name || recipe.title || 'Recipe'}</h1>
            <p className="recipe-description">{recipe.description || 'Delicious recipe with great flavors.'}</p>
            
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Prep Time:</span>
                <span className="meta-value">{recipe.prepTime || 30} mins</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cook Time:</span>
                <span className="meta-value">{recipe.cookTime || 15} mins</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Diet:</span>
                <span className="meta-value">{recipe.dietType || recipe.diet || 'Not specified'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cuisine:</span>
                <span className="meta-value">{recipe.cuisine || 'International'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Rating:</span>
                <span className="meta-value">
                  {renderStars(Math.round(getAverageRating()))} 
                  {getAverageRating()} ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="recipe-content">
          <div className="recipe-main">
            {/* Servings Adjuster */}
            <div className="servings-section">
              <h3>Servings</h3>
              <div className="servings-adjuster">
                <button onClick={() => adjustServings(servings - 1)}>-</button>
                <span>{servings}</span>
                <button onClick={() => adjustServings(servings + 1)}>+</button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="ingredients-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {getAdjustedIngredients().map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                    <span className="ingredient-name">{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="instructions-section">
              <h3>Instructions</h3>
              <ol className="instructions-list">
                {(Array.isArray(recipe.instructions) ? recipe.instructions : 
                  recipe.instructions.split('. ').filter(inst => inst.trim())
                ).map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    {instruction.trim().endsWith('.') ? instruction.trim() : instruction.trim() + '.'}
                  </li>
                ))}
              </ol>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3>Reviews & Ratings</h3>
              
              {isAuthenticated ? (
                <form className="review-form" onSubmit={submitReview}>
                  <div className="rating-input">
                    <label>Your Rating:</label>
                    <div className="stars-input">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star}
                          className={`star-input ${star <= userRating ? 'selected' : ''}`}
                          onClick={() => setUserRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                  ></textarea>
                  <button type="submit">Submit Review</button>
                </form>
              ) : (
                <div className="auth-prompt">
                  <p>Please <a href="/login">login</a> to leave a review.</p>
                </div>
              )}

              <div className="reviews-list">
                {reviews.length > 0 ? reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.username || 'Anonymous'}</span>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                  </div>
                )) : (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
