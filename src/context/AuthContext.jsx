import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, saveSession, clearSession } from '../utils/storage';

const AuthContext = createContext(null);

// Hardcoded MVP credentials
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'sfit2025';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session && session.loggedIn) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      saveSession({ loggedIn: true, loginTime: new Date().toISOString() });
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
