import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getSpendingInsights } from "../services/insights.service.js";

const router = express.Router();

/* ===============================
   GET /api/insights
   → budget + food spending insights
================================ */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const insights = await getSpendingInsights(req.userId);
    res.json(insights);
  } catch (err) {
    console.error("Insights error:", err);
    res.status(500).json({ message: "Failed to load insights" });
  }
});

export default router;
