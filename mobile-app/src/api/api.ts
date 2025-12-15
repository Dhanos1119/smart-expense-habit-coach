import axios from "axios";

/**
 * 🔥 IMPORTANT
 * - Use your PC's local IP (same WiFi as mobile)
 * - NO space, NO localhost for real device
 */
export const BASE = "http://172.20.10.6:4000";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------
   OPTIONAL (BUT VERY USEFUL): LOG NETWORK ERRORS
--------------------------------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.message === "Network Error") {
      console.error("❌ NETWORK ERROR → API not reachable:", BASE);
    }
    return Promise.reject(error);
  }
);

export default api;
