import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

/* ---------------- AUTH MIDDLEWARE ---------------- */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ---------------- ADD EXPENSE ---------------- */
router.post("/", requireAuth, async (req, res) => {
  const { amount, note } = req.body;

  if (!amount)
    return res.status(400).json({ message: "Amount required" });

  const expense = await prisma.expense.create({
    data: {
      amount: Number(amount),
      note,
      userId: req.userId,
    },
  });

  res.status(201).json(expense);
});

/* ---------------- GET ALL EXPENSES ---------------- */
router.get("/", requireAuth, async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(expenses);
});

/* ---------------- DELETE EXPENSE ---------------- */
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.expense.delete({
    where: { id },
  });

  res.json({ success: true });
});

export default router;
