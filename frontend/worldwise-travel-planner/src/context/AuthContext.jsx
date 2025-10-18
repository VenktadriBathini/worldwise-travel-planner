import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    if (accessToken) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [accessToken]);

  const register = async (email, password, display_name) => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        email,
        password,
        display_name,
      });
      const { user, accessToken, refreshToken } = res.data;
      alert("Registration successful! Please log in.");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user)); // Store full user object

      setAccessToken(accessToken);
      setUser(user);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.field_errors?.email ||
        "Registration failed";
      alert(errorMessage);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user)); // Store full user object

      setAccessToken(accessToken);
      setUser(user);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.field_errors?.email ||
        "Login failed";
      alert(errorMessage);
    }
  };

  // const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   localStorage.removeItem('user'); // Remove user object
  //   setUser(null);
  //   setAccessToken(null);
  //   navigate('/login');
  // };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
