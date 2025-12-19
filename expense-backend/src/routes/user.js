import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

/* ---------- AUTH MIDDLEWARE ---------- */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ---------- SAVE / UPDATE BUDGET ---------- */
router.post("/budget", requireAuth, async (req, res) => {
  const { monthlyBudget } = req.body;

  if (!monthlyBudget || monthlyBudget <= 0) {
    return res.status(400).json({ message: "Invalid budget" });
  }

  await prisma.user.update({
    where: { id: req.userId },
    data: { monthlyBudget },
  });

  res.json({ success: true, monthlyBudget });
});

router.get("/budget", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { monthlyBudget: true },
    });

    res.json({ monthlyBudget: user?.monthlyBudget ?? null });
  } catch (err) {
    res.status(500).json({ message: "Failed to load budget" });
  }
});


/* ---------- GET USER (for restore) ---------- */
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      monthlyBudget: true,
    },
  });

  res.json(user);
});

export default router;
