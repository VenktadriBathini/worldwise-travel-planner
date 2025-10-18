// src/api/axiosClient.js
import axios from "axios";

const API = "http://localhost:3001";

export const axiosClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // avoid infinite pending requests
});

// ---- token helpers ----
function getAccess() {
  return localStorage.getItem("accessToken");
}
function setAccess(v) {
  v
    ? localStorage.setItem("accessToken", v)
    : localStorage.removeItem("accessToken");
}
function getRefresh() {
  return localStorage.getItem("refreshToken");
}
function setRefresh(v) {
  v
    ? localStorage.setItem("refreshToken", v)
    : localStorage.removeItem("refreshToken");
}

// ---- request interceptor: attach access token ----
axiosClient.interceptors.request.use((config) => {
  const t = getAccess();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Utility: is this an auth endpoint where we should NOT try refreshing?
function isAuthPath(url = "") {
  // prevent refresh attempts on register/login/refresh endpoints
  return (
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/refresh")
  );
}

// ---- response interceptor: single refresh attempt on 401 (non-auth paths) ----
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Network / timeout cases (no response object)
    if (!err.response) {
      // Normalize error so UI can show a message and stop loading
      err.normalized = {
        status: 0,
        error: "network_error",
        message: err.message || "Network error",
      };
      throw err;
    }

    const { status, data, config } = err.response;
    const original = config || {};

    // 400/409/etc: DO NOT retry, just normalize and throw so UI can handle it
    if (status === 400) {
      err.normalized = {
        status,
        error: data?.error || "validation_error",
        details: data?.details,
      };
      throw err;
    }
    if (status === 409) {
      // duplicate email, etc.
      err.normalized = { status, error: data?.error || "conflict" };
      throw err;
    }

    // If it's an auth route or we already retried, don't refresh
    if (status === 401 && !original._retry && !isAuthPath(original.url)) {
      original._retry = true;

      const rt = getRefresh();
      if (!rt) {
        err.normalized = { status, error: data?.error || "unauthorized" };
        throw err;
      }

      try {
        const { data: ref } = await axios.post(
          `${API}/api/auth/refresh`,
          { refreshToken: rt },
          { timeout: 15000 }
        );
        setAccess(ref.accessToken);
        setRefresh(ref.refreshToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${ref.accessToken}`;
        return axiosClient(original);
      } catch (refreshErr) {
        // Refresh failed — clear tokens and normalize error
        setAccess(null);
        setRefresh(null);
        refreshErr.normalized = { status: 401, error: "invalid_refresh_token" };
        throw refreshErr;
      }
    }

    // Other statuses: normalize so caller can show a message and stop loading
    err.normalized = { status, error: data?.error || "request_failed" };
    throw err;
  }
);

// small helpers
export const tokenStore = { getAccess, setAccess, getRefresh, setRefresh };
