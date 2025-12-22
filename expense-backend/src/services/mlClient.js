import axios from "axios";

const ML_BASE_URL = "http://127.0.0.1:8000";

export async function predictHabit(features) {
  try {
    const res = await axios.post(`${ML_BASE_URL}/predict`, features, {
      headers: { "Content-Type": "application/json" },
      timeout: 3000,
    });

    return res.data;
  } catch (err) {
    console.error("ML Service Error:", err.message);
    throw new Error("ML prediction failed");
  }
}
