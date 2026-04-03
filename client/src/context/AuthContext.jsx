import { createContext, useState, useEffect } from 'react';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const userData = JSON.parse(userInfo);
          setUser(userData);
          setToken(userData.token);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      });
      
      // Store user info
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setToken(data.token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        role: role || 'user'
      });
      
      // Store user info
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setToken(data.token);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setToken(null);
  };

  // Update user in context + localStorage after profile save
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(merged));
    setUser(merged);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
