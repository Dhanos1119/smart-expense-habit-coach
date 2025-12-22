import api from "./api";

export async function fetchInsights() {
  try {
    const res = await api.get("/api/insights");
    return res.data;
  } catch (err) {
    console.error("fetchInsights failed", err);
    return null;
  }
}
