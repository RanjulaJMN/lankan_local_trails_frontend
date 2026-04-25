// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, isAuthenticated, getUserRole, clearInvalidAuthData } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        clearInvalidAuthData();
        
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          const userRole = getUserRole();
          
          console.log("Loading auth state - User:", userData);
          console.log("Loading auth state - Role:", userRole);
          
          setUser(userData);
          setRole(userRole);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = (userData, userRole) => {
    console.log("Login called with user:", userData);
    console.log("Login called with role:", userRole);
    
    // Handle different response structures
    const userInfo = userData.user || userData;
    setUser(userInfo);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: role === "ADMIN",
    isUser: role === "USER",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};