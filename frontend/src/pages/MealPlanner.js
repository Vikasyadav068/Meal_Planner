import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MealPlanner.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];

const MealPlanner = () => {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchRecipes();
    }
  }, [currentUser]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.slice(0, 12)); // Limit to 12 recipes for memory efficiency
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = (day, mealType) => {
    if (!recipes[currentRecipeIndex]) return;
    const key = `${day}-${mealType}`;
    setMealPlan(prev => ({ ...prev, [key]: recipes[currentRecipeIndex] }));
  };

  const removeMeal = (day, mealType) => {
    const key = `${day}-${mealType}`;
    setMealPlan(prev => {
      const newPlan = { ...prev };
      delete newPlan[key];
      return newPlan;
    });
  };

  // Drag and Drop Functions
  const handleDragStart = (e, recipe) => {
    setDraggedRecipe(recipe);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, day, mealType) => {
    e.preventDefault();
    if (draggedRecipe) {
      const key = `${day}-${mealType}`;
      setMealPlan(prev => ({ ...prev, [key]: draggedRecipe }));
      setDraggedRecipe(null);
    }
  };

  const generateShoppingList = () => {
    const ingredients = new Set();
    Object.values(mealPlan).forEach(recipe => {
      if (recipe?.ingredients) {
        recipe.ingredients.forEach(ing => {
          if (typeof ing === 'string') {
            ingredients.add(ing);
          } else if (ing?.name) {
            ingredients.add(`${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim());
          }
        });
      }
    });
    
    const list = Array.from(ingredients);
    localStorage.setItem('shoppingList', JSON.stringify(list));
    alert(`Shopping list generated! ${list.length} ingredients saved.`);
  };

  if (!currentUser) {
    return (
      <div className="meal-planner">
        <div className="container">
          <h2>Please log in to access the Meal Planner</h2>
        </div>
      </div>
    );
  }

  const currentRecipe = recipes[currentRecipeIndex];

  return (
    <div className="meal-planner">
      <div className="container">
        <h1>🍽️ Weekly Meal Planner</h1>
        
        {loading ? (
          <div>Loading recipes...</div>
        ) : (
          <div>
            <div className="recipe-browser">
              <h3>Current Recipe</h3>
              {currentRecipe ? (
                <div 
                  className="recipe-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, currentRecipe)}
                >
                  <div className="recipe-image-placeholder">
                    🍽️
                  </div>
                  <h4>{currentRecipe.title}</h4>
                  <p className="recipe-meta">
                    <span className="cuisine">{currentRecipe.cuisine}</span> • 
                    <span className="time"> {currentRecipe.prepTime}min</span> • 
                    <span className="diet"> {currentRecipe.diet}</span>
                  </p>
                  <div className="drag-hint">
                    👆 Drag this recipe to a meal slot below
                  </div>
                  
                  <div className="recipe-controls">
                    <button 
                      className="nav-btn prev-btn"
                      onClick={() => setCurrentRecipeIndex(prev => prev > 0 ? prev - 1 : recipes.length - 1)}
                    >
                      ← Previous
                    </button>
                    <span className="recipe-counter">{currentRecipeIndex + 1} of {recipes.length}</span>
                    <button 
                      className="nav-btn next-btn"
                      onClick={() => setCurrentRecipeIndex(prev => prev < recipes.length - 1 ? prev + 1 : 0)}
                    >
                      Next →
                    </button>
                  </div>
                  
                  <button 
                    className="details-btn"
                    onClick={() => setSelectedRecipe(currentRecipe)}
                  >
                    View Details
                  </button>
                </div>
              ) : (
                <div className="no-recipe">No recipes available</div>
              )}
            </div>

            <div className="meal-planner-grid">
              <h3>Weekly Meal Plan</h3>
              <div className="weekly-grid">
                {DAYS.map(day => (
                  <div key={day} className="day-column">
                    <h4>{day}</h4>
                    {MEALS.map(meal => {
                      const key = `${day}-${meal}`;
                      const assignedMeal = mealPlan[key];
                      
                      return (
                        <div 
                          key={meal} 
                          className={`meal-slot ${assignedMeal ? 'has-meal' : 'empty'}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, meal)}
                        >
                          <div className="meal-header">
                            <strong className="meal-type">{meal}</strong>
                            {currentRecipe && !assignedMeal && (
                              <button 
                                className="add-btn" 
                                onClick={() => addMeal(day, meal)}
                                title={`Add ${currentRecipe.title}`}
                              >
                                +
                              </button>
                            )}
                          </div>
                          
                          {assignedMeal ? (
                            <div className="assigned-meal">
                              <span className="meal-title">{assignedMeal.title}</span>
                              <span className="meal-info">{assignedMeal.prepTime}min</span>
                              <button 
                                className="remove-btn"
                                onClick={() => removeMeal(day, meal)}
                                title="Remove meal"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="empty-slot">
                              <div className="drop-zone">
                                📥 Drop recipe here
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="actions">
              <button onClick={generateShoppingList} className="primary-btn">
                🛒 Generate Shopping List
              </button>
              <button onClick={() => setMealPlan({})}>🗑️ Clear All</button>
            </div>
          </div>
        )}

        {selectedRecipe && (
          <div className="modal" onClick={() => setSelectedRecipe(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedRecipe.title}</h3>
              <p><strong>Prep Time:</strong> {selectedRecipe.prepTime} minutes</p>
              <p><strong>Cuisine:</strong> {selectedRecipe.cuisine}</p>
              <p><strong>Diet:</strong> {selectedRecipe.diet}</p>
              
              {selectedRecipe.ingredients && (
                <div>
                  <h4>Ingredients:</h4>
                  <ul>
                    {selectedRecipe.ingredients.slice(0, 10).map((ingredient, index) => (
                      <li key={index}>
                        {typeof ingredient === 'string' ? ingredient : 
                         `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button onClick={() => setSelectedRecipe(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
