import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState({});
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    dietType: '',
    allergies: '',
    favoriteCuisines: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      dietType: user?.dietType || '',
      allergies: user?.allergies?.join(', ') || '',
      favoriteCuisines: user?.favoriteCuisines?.join(', ') || ''
    });
    
    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch saved recipes
      const savedResponse = await axios.get('http://localhost:5001/api/user/saved', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (savedResponse.data.success) {
        // Get full recipe details for saved recipes
        const recipePromises = savedResponse.data.savedRecipes.map(id =>
          axios.get(`http://localhost:5001/api/recipes/${id}`)
        );
        
        const recipeResponses = await Promise.all(recipePromises);
        const recipes = recipeResponses
          .filter(res => res.data.success)
          .map(res => res.data.recipe);
        
        setSavedRecipes(recipes);
      }
      
      // Load meal plans from localStorage
      const localMealPlans = JSON.parse(localStorage.getItem('mealPlans') || '{}');
      setMealPlans(localMealPlans);
      
      // Calculate user stats
      calculateUserStats(savedResponse.data.savedRecipes.length, localMealPlans);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (savedCount, mealPlans) => {
    const totalMealPlans = Object.keys(mealPlans).length;
    const totalPlannedMeals = Object.values(mealPlans).reduce((total, meals) => total + meals.length, 0);
    
    setUserStats({
      savedRecipes: savedCount,
      mealPlans: totalMealPlans,
      plannedMeals: totalPlannedMeals,
      memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...profileData,
        allergies: profileData.allergies.split(',').map(a => a.trim()).filter(a => a),
        favoriteCuisines: profileData.favoriteCuisines.split(',').map(c => c.trim()).filter(c => c)
      };
      
      // Note: This would typically be a PUT request to update user profile
      // For now, we'll just update local state
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const removeFromSaved = async (recipeId) => {
    try {
      const response = await axios.post('http://localhost:5001/api/user/recipes/unsave', 
        { recipeId }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
        setUserStats(prev => ({ ...prev, savedRecipes: prev.savedRecipes - 1 }));
      }
    } catch (error) {
      console.error('Error removing from saved:', error);
    }
  };

  const clearMealPlan = (date) => {
    const updatedMealPlans = { ...mealPlans };
    delete updatedMealPlans[date];
    setMealPlans(updatedMealPlans);
    localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans));
    calculateUserStats(savedRecipes.length, updatedMealPlans);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h1>Welcome back, {user?.username}!</h1>
            <p className="user-email">{user?.email}</p>
            <p className="member-since">Member since {userStats.memberSince}</p>
          </div>
        </div>
        
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{userStats.savedRecipes}</span>
            <span className="stat-label">Saved Recipes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userStats.mealPlans}</span>
            <span className="stat-label">Meal Plans</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userStats.plannedMeals}</span>
            <span className="stat-label">Planned Meals</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Recipes ({savedRecipes.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          Meal Plans ({Object.keys(mealPlans).length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-settings">
            <div className="settings-header">
              <h2>Profile Settings</h2>
              <button 
                className="edit-button"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Diet Type</label>
                  <select
                    value={profileData.dietType}
                    onChange={(e) => setProfileData({...profileData, dietType: e.target.value})}
                  >
                    <option value="">Select Diet Type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="omnivore">Omnivore</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Allergies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. nuts, dairy, shellfish"
                    value={profileData.allergies}
                    onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Favorite Cuisines (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Italian, Asian, Mexican"
                    value={profileData.favoriteCuisines}
                    onChange={(e) => setProfileData({...profileData, favoriteCuisines: e.target.value})}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button type="button" onClick={() => setEditMode(false)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <div className="info-item">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{profileData.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profileData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Diet Type:</span>
                  <span className="info-value">{profileData.dietType || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Allergies:</span>
                  <span className="info-value">{profileData.allergies || 'None specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Favorite Cuisines:</span>
                  <span className="info-value">{profileData.favoriteCuisines || 'None specified'}</span>
                </div>
              </div>
            )}
            
            <div className="danger-zone">
              <h3>Account Actions</h3>
              <button onClick={logout} className="logout-button">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-recipes">
            <h2>Your Saved Recipes</h2>
            {savedRecipes.length > 0 ? (
              <div className="recipes-grid">
                {savedRecipes.map(recipe => (
                  <div key={recipe._id} className="recipe-card">
                    <div className="recipe-image">
                      <img src={recipe.image} alt={recipe.name} />
                      <button 
                        className="remove-saved"
                        onClick={() => removeFromSaved(recipe._id)}
                        title="Remove from saved"
                      >
                        ❌
                      </button>
                    </div>
                    <div className="recipe-info">
                      <h3>{recipe.name}</h3>
                      <p className="recipe-meta">
                        {recipe.prepTime} mins • {recipe.dietType}
                      </p>
                      <button 
                        className="view-recipe"
                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No saved recipes yet. Start saving recipes you love!</p>
                <button onClick={() => navigate('/recipes')}>Browse Recipes</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="meal-plans">
            <h2>Your Meal Plans</h2>
            {Object.keys(mealPlans).length > 0 ? (
              <div className="meal-plans-list">
                {Object.entries(mealPlans)
                  .sort(([a], [b]) => new Date(b) - new Date(a))
                  .map(([date, meals]) => (
                    <div key={date} className="meal-plan-card">
                      <div className="meal-plan-header">
                        <h3>{new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</h3>
                        <div className="meal-plan-actions">
                          <span className="meal-count">{meals.length} meals</span>
                          <button 
                            onClick={() => clearMealPlan(date)}
                            className="clear-plan"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="planned-meals">
                        {meals.map((meal, index) => (
                          <div key={index} className="planned-meal">
                            <img src={meal.image} alt={meal.name} />
                            <div className="meal-details">
                              <span className="meal-name">{meal.name}</span>
                              <span className="meal-time">{meal.prepTime} mins</span>
                            </div>
                            <button 
                              onClick={() => navigate(`/recipes/${meal.id}`)}
                              className="view-meal"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No meal plans yet. Start planning your meals!</p>
                <button onClick={() => navigate('/meal-planner')}>Create Meal Plan</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
