import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // Ensure axios has Authorization header when token exists
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // If there's a token in localStorage when app loads, ensure state is synced
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setAccessToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn("Could not parse stored user", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  /**
   * Register should create account and then redirect to /login
   * (Requirement: after signup it should redirect to login page if there are no errors)
   */
  const register = async (email, password, display_name) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        display_name,
      });

      // If your backend returns immediate tokens and you still want to force
      // user to login manually, ignore tokens and redirect to /login.
      // If you WANT to auto-login, uncomment the token storing lines below.
      // const { user, accessToken, refreshToken } = res.data;
      alert("Registration successful! Please log in.");
      navigate("/login");
      return { ok: true };
    } catch (err) {
      console.error("Register error:", err?.response?.data || err.message);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.field_errors?.email ||
        "Registration failed";
      return { ok: false, error: errorMessage };
    }
  };

  /**
   * Login stores tokens + user and navigates to /dashboard
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // expected: { user, accessToken, refreshToken }
      const { user: u, accessToken: at, refreshToken: rt } = res.data;

      if (!at || !rt) {
        // handle unexpected response shape gracefully
        console.warn("Login response missing tokens", res.data);
        return { ok: false, error: "Invalid login response from server" };
      }

      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      localStorage.setItem("user", JSON.stringify(u));

      setAccessToken(at);
      setUser(u);
      axios.defaults.headers.common["Authorization"] = `Bearer ${at}`;

      navigate("/dashboard");
      return { ok: true };
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.field_errors?.email ||
        "Login failed";
      return { ok: false, error: errorMessage };
    }
  };

  /**
   * Logout clears local storage and redirects to login
   */
  const logout = () => {
    // optionally call backend to revoke refresh token here
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setAccessToken(null);
    delete axios.defaults.headers.common["Authorization"];

    navigate("/login");
  };

  /**
   * Optional: a refresh token helper (very basic)
   * You should wire an axios interceptor to call this when you get 401 responses.
   */
  const refreshAccessToken = async () => {
    try {
      const rt = localStorage.getItem("refreshToken");
      if (!rt) throw new Error("No refresh token available");
      const res = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: rt,
      });
      const { accessToken: newAt } = res.data;
      localStorage.setItem("accessToken", newAt);
      setAccessToken(newAt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newAt}`;
      return { ok: true };
    } catch (err) {
      console.warn(
        "Refresh failed, logging out",
        err?.response?.data || err.message
      );
      logout();
      return { ok: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
