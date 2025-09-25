import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clearAuthState = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/user/login", {
        email,
        password,
      });

      if (!response.data) {
        throw new Error("No response data received");
      }

      if (!response.data.token) {
        console.error("Missing token in response:", response.data);
        throw new Error("Server response missing token");
      }

      if (!response.data.user) {
        console.error("Missing user data in response:", response.data);
        throw new Error("Server response missing user data");
      }

      setAuthToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      clearAuthState();
      throw error;
    }
  };
  
  const signupUser = async (userData) => {
    try {
      const response = await api.post("/api/user/signup", {
        ...userData,
      });

      return response.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
      api.get("/api/user/profile").catch(() => clearAuthState());
    }
    setLoading(false);
  }, []);

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    signupUser,
    setUser,
    setAuthToken
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
