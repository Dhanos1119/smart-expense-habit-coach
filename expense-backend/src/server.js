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

// ROUTES & MIDDLEWARE
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

/* -------------------------------------------------
   PATH FIX (ESM SAFE – WINDOWS SAFE)
------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   UPLOADS FOLDER (SAFE + REQUIRED)
------------------------------------------------- */
const uploadsDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// serve uploaded images
app.use("/uploads", express.static(uploadsDir));

/* -------------------------------------------------
   MULTER CONFIG (FINAL – WINDOWS SAFE)
------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 🔥 ALWAYS absolute, based on project root
    cb(null, path.join(process.cwd(), "uploads"));
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
   PROFILE IMAGE UPLOAD (PROTECTED)
------------------------------------------------- */
app.post(
  "/profile/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      console.log("🔥 FILE:", req.file);
      console.log("🔥 USER ID:", req.userId);

      if (!req.file) {
        return res.status(400).json({ message: "No file received" });
      }

      const avatarUrl = `/uploads/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: Number(req.userId) },
        data: { avatarUrl },
      });

      console.log("🔥 USER UPDATED:", user);

      res.json({ avatarUrl });
    } catch (err) {
      console.error("🔥 AVATAR UPLOAD ERROR FULL:", err);
      res.status(500).json({ message: err.message });
    }
  }
);


/* -------------------------------------------------
   GET LOGGED-IN USER INFO
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
    console.error("Error fetching /api/me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------
   EXPENSE ROUTES (PROTECTED)
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
    console.error("Error creating expense:", err);
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
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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

/* -------------------------------------------------
   SERVER START & CLEANUP
------------------------------------------------- */
const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  console.log(`🚀 Server running on port ${port}`)
);

const shutdown = async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
