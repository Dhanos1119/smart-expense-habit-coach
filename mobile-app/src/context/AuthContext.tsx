import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";

export const AuthContext = createContext<any>(null);

const TOKEN_KEY = "accessToken";

/* ================= STORAGE HELPERS ================= */

async function readTokenFromStorage(): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync(TOKEN_KEY);
    if (v) return v;
  } catch {}

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
  } catch {}

  return null;
}

async function saveTokenToStorage(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {}

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
}

async function removeTokenFromStorage() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {}

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* 🔁 RESTORE SESSION ON APP START */
  useEffect(() => {
    (async () => {
      try {
        const t = await readTokenFromStorage();

        if (!t) {
          setLoading(false);
          return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${t}`;
        setToken(t);

        const res = await api.get("/api/me");
        setUser(res.data?.user ?? null);
      } catch (e) {
        // token invalid / expired
        await removeTokenFromStorage();
        delete api.defaults.headers.common.Authorization;
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= EMAIL + PASSWORD LOGIN ================= */

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await api.post("/api/auth/login", { email, password });

    const t = res.data?.token;
    if (!t) throw new Error("No token returned from server");

    await saveTokenToStorage(t);
    api.defaults.headers.common.Authorization = `Bearer ${t}`;

    setToken(t);
    setUser(res.data.user);

    return res.data;
  };

  /* ================= TOKEN LOGIN (GOOGLE / APPLE) ================= */

  const loginWithToken = async (t: string) => {
    if (!t) throw new Error("Token missing");

    await saveTokenToStorage(t);
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    setToken(t);

    const res = await api.get("/api/me");
    setUser(res.data?.user ?? null);
  };

  /* ================= GET TOKEN (FOR API CALLS) ================= */

  const getToken = async () => {
    const t = token ?? (await readTokenFromStorage());
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
    return t;
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await removeTokenFromStorage();
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        loginWithToken,
        getToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
