import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export { AuthContext }; // Export the context

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/profile');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setCurrentUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  };

  const register = async (userData) => {
    const response = await axios.post('http://localhost:5001/api/auth/register', userData);
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setCurrentUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    user: currentUser, // Alias for compatibility
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
