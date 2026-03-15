import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const userKey = 'user';
const tokenKey = 'token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(userKey);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {
        localStorage.removeItem(userKey);
        localStorage.removeItem(tokenKey);
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(tokenKey, token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);
    setUser(null);
  };

  const getToken = () => localStorage.getItem(tokenKey);

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
