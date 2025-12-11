// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api/api"; // central axios instance (src/api.ts)

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Restore token on app start
  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync("accessToken");
        if (t) {
          setToken(t);
          api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
          // optional: load user profile
          try {
            const resp = await api.get("/api/users/me"); // adjust if your endpoint differs
            setUser(resp.data);
          } catch (e) {
            // profile fetch error is non-fatal
            console.warn("[Auth] profile fetch failed", e);
          }
        }
      } catch (e) {
        console.warn("[Auth] restore token error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // login: call backend and persist token
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      // DEBUG: log where we're calling
      console.log("[Auth] login -> POST", api.defaults.baseURL + "/api/auth/login");

      const res = await api.post("/api/auth/login", { email, password });
      // backend may return token as res.data.token or res.data.accessToken
      const t = res.data?.accessToken || res.data?.token;
      if (!t) throw new Error("No token returned from server");

      await SecureStore.setItemAsync("accessToken", t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);

      // optional: set user if returned
      if (res.data.user) setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      // surface helpful debug info
      console.error("[Auth] login error:", err?.response?.status, err?.response?.data || err?.message);
      // rethrow so UI can show error
      throw err;
    }
  };

  const logout = async () => {
    try {
      // optional: tell backend
      try { await api.post("/api/auth/logout"); } catch (e) {}
      await SecureStore.deleteItemAsync("accessToken");
      delete api.defaults.headers.common["Authorization"];
      setToken(null);
      setUser(null);
    } catch (e) {
      console.warn("[Auth] logout error", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
