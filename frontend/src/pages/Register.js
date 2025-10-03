import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    diet: '',
    allergies: '',
    cuisines: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        ...formData,
        allergies: formData.allergies.split(',').map(item => item.trim()).filter(item => item),
        cuisines: formData.cuisines.split(',').map(item => item.trim()).filter(item => item)
      };
      
      await register(userData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Join TasteTrail</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Dietary Preference</label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
            >
              <option value="">Select diet type</option>
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
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g., nuts, dairy, shellfish"
            />
          </div>
          
          <div className="form-group">
            <label>Favorite Cuisines (comma separated)</label>
            <input
              type="text"
              name="cuisines"
              value={formData.cuisines}
              onChange={handleChange}
              placeholder="e.g., Italian, Indian, Mexican"
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
