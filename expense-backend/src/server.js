// src/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import expenseRoutes from "./routes/expenses.js";

// ROUTES & MIDDLEWARE
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();

/* -------------------------------------------------
   MIDDLEWARE
------------------------------------------------- */
app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

const prisma = new PrismaClient();

/* -------------------------------------------------
   PATH FIX (ESM SAFE)
------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   UPLOADS FOLDER
------------------------------------------------- */
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🔥 STATIC FILE SERVE (CORRECT)
app.use("/uploads", express.static(uploadsDir));

/* -------------------------------------------------
   MULTER CONFIG
------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.userId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* -------------------------------------------------
   AUTH ROUTES
------------------------------------------------- */
app.use("/api/auth", authRoutes);

/* -------------------------------------------------
   PROFILE IMAGE UPLOAD
------------------------------------------------- */
app.post(
  "/profile/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file received" });
      }

      const avatarUrl = `/uploads/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: Number(req.userId) },
        data: { avatarUrl },
      });

      res.json({ avatarUrl });
    } catch (err) {
      console.error("Avatar upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* -------------------------------------------------
   GET LOGGED-IN USER
------------------------------------------------- */
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.userId) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        avatarUrl: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("/api/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------
   EXPENSE ROUTES
------------------------------------------------- */
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
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(req.userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------
   SERVER START
------------------------------------------------- */
const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  console.log(`🚀 Server running on port ${port}`)
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
