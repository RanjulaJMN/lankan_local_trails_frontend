// src/api/authApi.js
import api from "./axios";

export const adminLogin = async (credentials) => {
  try {
    // First, login to get token
    const response = await api.post("/api/auth/login", credentials);
    console.log("Login response:", response.data);
    
    if (response.data.token) {
      // Store the token
      localStorage.setItem("token", response.data.token);
      
      // Now fetch user profile using the token
      try {
        const userResponse = await api.get("/api/users/profile");
        console.log("User profile response:", userResponse.data);
        
        const userData = userResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Set role based on user data
        const role = userData.role === "ROLE_ADMIN" ? "ADMIN" : "USER";
        localStorage.setItem("role", role);
        
        return {
          token: response.data.token,
          user: userData,
          role: role
        };
      } catch (userError) {
        console.error("Error fetching user profile:", userError);
        // If can't fetch user data, just return token
        return response.data;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const userLogin = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    console.log("Login response:", response.data);
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      
      // Fetch user profile
      try {
        const userResponse = await api.get("/api/users/profile");
        const userData = userResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        const role = userData.role === "ROLE_ADMIN" ? "ADMIN" : "USER";
        localStorage.setItem("role", role);
        
        return {
          token: response.data.token,
          user: userData,
          role: role
        };
      } catch (userError) {
        console.error("Error fetching user profile:", userError);
        return response.data;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("User login error:", error);
    throw error;
  }
};

export const adminRegister = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", {
      ...userData,
      role: "ROLE_ADMIN"
    });
    return response.data;
  } catch (error) {
    console.error("Admin register error:", error);
    throw error;
  }
};

export const userRegister = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", {
      ...userData,
      role: "ROLE_USER"
    });
    return response.data;
  } catch (error) {
    console.error("User register error:", error);
    throw error;
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.location.href = "/";
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr && userStr !== "undefined" && userStr !== "null") {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!(token && token !== "undefined" && token !== "null");
};

export const getUserRole = () => {
  const role = localStorage.getItem("role");
  if (role && role !== "undefined" && role !== "null") {
    return role;
  }
  return null;
};

export const clearInvalidAuthData = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  
  if (token === "undefined" || user === "undefined" || role === "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return true;
  }
  return false;
};