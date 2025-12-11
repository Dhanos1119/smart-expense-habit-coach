// mobile-app/src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";

export const AuthContext = createContext<any>(null);

const LC_KEY = "accessToken";

async function readTokenFromStorage(): Promise<string | null> {
  // Try SecureStore (native)
  try {
    const v = await SecureStore.getItemAsync(LC_KEY);
    if (v) return v;
  } catch (e) {
    // ignore
  }
  // Fallback to localStorage (web)
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(LC_KEY);
    }
  } catch (e) {}
  return null;
}

async function saveTokenToStorage(token: string) {
  try {
    await SecureStore.setItemAsync(LC_KEY, token);
  } catch (e) {}
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(LC_KEY, token);
    }
  } catch (e) {}
}

async function removeTokenFromStorage() {
  try {
    await SecureStore.deleteItemAsync(LC_KEY);
  } catch (e) {}
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(LC_KEY);
    }
  } catch (e) {}
}

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await readTokenFromStorage();
       if (t) {
  api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  try {
    const resp = await api.get("/api/me");   // <-- use /api/me
    setUser(resp.data?.user ?? null);
  } catch (e) { console.warn("profile fetch failed on restore", e); }
}
      } catch (e) {
        console.warn("[Auth] restore error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", { email, password });
    const t = res.data?.accessToken || res.data?.token;
    if (!t) throw new Error("No token returned from server");
    await saveTokenToStorage(t);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    setToken(t);
    if (res.data.user) setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      try { await api.post("/api/auth/logout"); } catch (e) {}
      await removeTokenFromStorage();
      delete api.defaults.headers.common["Authorization"];
      setToken(null);
      setUser(null);
    } catch (e) {
      console.warn("[Auth] logout error", e);
    }
  };

  return <AuthContext.Provider value={{ token, user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
