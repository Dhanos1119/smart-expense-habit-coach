// mobile-app/src/api.ts
import axios from "axios";

const BASE = "http://172.20.10.6:4000"; // <- replace with your PC IP or ngrok HTTPS url

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: export the base in case you need it elsewhere
export { BASE };

export default api;
