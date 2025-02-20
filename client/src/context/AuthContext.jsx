import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
    signOut(auth).then(() => {
      clearAuthState();
      navigate("/login");
    });
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
        password
      });

      console.log('Login response:', response.data); // Debug log

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Check the actual structure of your response
      if (!response.data.token) {
        console.error('Missing token in response:', response.data);
        throw new Error('Server response missing token');
      }

      if (!response.data.user) { // Changed from userData to user if that's what your API returns
        console.error('Missing user data in response:', response.data);
        throw new Error('Server response missing user data');
      }

      setAuthToken(response.data.token);
      setUser(response.data.user); // Changed from userData to user
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      clearAuthState();
      throw error;
    }
  };

  const createFirebaseUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Firebase signup error:", error);
      throw error;
    }
  };

  const signupUser = async (userData) => {
    try {
      // First create Firebase user
      const firebaseUser = await createFirebaseUser(userData.email, userData.password);
      
      // Then create MongoDB user
      const response = await api.post("/api/user/signup", {
        ...userData,
        firebaseUid: firebaseUser.uid,
      });

      return response.data;
    } catch (error) {
      // If Firebase user was created but MongoDB failed, try to delete Firebase user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      throw error;
    }
  };

  useEffect(() => {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
      // Optionally verify token with backend
      api.get("/api/user/verify-token")
        .catch(() => clearAuthState());
    }
    setLoading(false);
  }, []);

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: () => !!user && !!localStorage.getItem("token"),
    getToken: () => localStorage.getItem("token"),
    signupUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};