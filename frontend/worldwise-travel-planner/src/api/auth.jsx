// src/api/auth.js
import { axiosClient, tokenStore } from "./axiosClient";

export async function register({ email, password, display_name }) {
  const { data } = await axiosClient.post("/api/auth/register", {
    email,
    password,
    display_name,
  });
  tokenStore.setAccess(data.accessToken);
  tokenStore.setRefresh(data.refreshToken);
  return data.user;
}

export async function login({ email, password }) {
  const { data } = await axiosClient.post("/api/auth/login", {
    email,
    password,
  });
  tokenStore.setAccess(data.accessToken);
  tokenStore.setRefresh(data.refreshToken);
  return data.user;
}

export async function me() {
  try {
    const { data } = await axiosClient.get("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export function logout() {
  tokenStore.setAccess(null);
  tokenStore.setRefresh(null);
}
