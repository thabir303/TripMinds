// src/components/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the context
export const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp && decodedUser.exp > currentTime) {
          setUser(decodedUser);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      console.error('Error loading auth state:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (token) => {
    try {
      setError(null);
      const decodedUser = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser(decodedUser);
      return true;
    } catch (err) {
      setError('Invalid token format');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Get auth token
  const getToken = () => localStorage.getItem('token');

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    getToken,
    isAuthenticated: !!user
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};