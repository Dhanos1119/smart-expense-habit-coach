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
        if (t) {
          api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
          setToken(t);

          try {
            const resp = await api.get("/api/me");
            setUser(resp.data?.user ?? null);
          } catch (e) {
            console.warn("Profile fetch failed on restore", e);
          }
        }
      } catch (e) {
        console.warn("[Auth] restore error", e);
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
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;

    setToken(t);
    setUser(res.data.user);

    return res.data;
  };

  /* ================= TOKEN-BASED LOGIN (GOOGLE / APPLE) ================= */

  const loginWithToken = async (t: string) => {
    if (!t) throw new Error("Token missing");

    await saveTokenToStorage(t);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;

    setToken(t);

    try {
      const resp = await api.get("/api/me");
      setUser(resp.data?.user ?? null);
    } catch (e) {
      console.warn("Profile fetch failed after token login", e);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    try {
      await removeTokenFromStorage();
      delete api.defaults.headers.common["Authorization"];

      setToken(null);
      setUser(null);
    } catch (e) {
      console.warn("[Auth] logout error", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,          // email + password
        loginWithToken, // google / apple
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
