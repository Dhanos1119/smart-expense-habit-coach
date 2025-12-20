import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

/* ================= AUTH MIDDLEWARE ================= */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid" });
  }
}

/* ================= ADD EXPENSE ================= */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { amount, note, category, date } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        note: note || "",
        category: category && category.trim() !== "" ? category : "Other", // 🔥 FIX
        date: date ? new Date(date) : undefined,                          // 🔥 FIX
        userId: req.userId,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add expense" });
  }
});

/* ================= GET ALL EXPENSES ================= */
router.get("/", requireAuth, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(expenses);
  } catch (err) {
     console.log("Fetch error:", err);
  setUser(null);
  }
});

/* ================= DELETE EXPENSE ================= */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const expense = await prisma.expense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await prisma.expense.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

export default router;
