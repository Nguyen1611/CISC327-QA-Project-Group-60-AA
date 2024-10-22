import React, { createContext, useState } from "react";

// Create the context
export const AuthContext = createContext();

// Provide the context to components
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
