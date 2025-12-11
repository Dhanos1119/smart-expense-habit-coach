// src/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// ROUTES & MIDDLEWARE
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());


const prisma = new PrismaClient();

// ------------------------------
// AUTH ROUTES
// ------------------------------
app.use("/api/auth", authRoutes);

// ------------------------------
// PROTECTED ROUTES
// ------------------------------

// GET logged-in user info
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.userId) },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Error fetching /api/me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE expense (protected)
app.post("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const { amount, currency = "LKR", note } = req.body;

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        currency,
        note,
        userId: Number(req.userId),
      },
    });

    res.status(201).json({ expense });
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all expenses of logged-in user
app.get("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(req.userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json({ expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE an expense (only allowed if it exists)
app.delete("/api/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await prisma.expense.delete({
      where: { id },
    });
    res.json({ deleted });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------
const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// Graceful shutdown to close Prisma connection
const shutdown = async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
