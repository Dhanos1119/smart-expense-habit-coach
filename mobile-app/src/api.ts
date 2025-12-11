// src/api.ts
import axios from "axios";
export const api = axios.create({
  baseURL: process.env.API_BASE_URL || "https://your-api.com",
  // withCredentials: true, // enable if backend uses cookies for refresh token
});
export default api;
