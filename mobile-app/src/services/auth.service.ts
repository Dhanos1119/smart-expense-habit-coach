// src/services/auth.service.ts
import api from "../api/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const AuthService = {
  async login(data: LoginPayload) {
    const res = await api.post("/auth/login", data);
    return res.data; // { token, user }
  },

  async register(data: RegisterPayload) {
    const res = await api.post("/auth/register", data);
    return res.data; // { message, user }
  },

  async logout() {
    try {
      await api.post("/auth/logout"); // optional backend logout
    } catch (e) {
      console.log("Logout error:", e);
    }
  },
};
