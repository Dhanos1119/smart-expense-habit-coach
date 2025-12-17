// src/routes/auth.js
import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ======================================================
   REGISTER (EMAIL + PASSWORD)
   POST /api/auth/register
   ====================================================== */
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be >= 6 chars"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(409).json({ message: "User already exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hash,
          name,
          provider: "local",
        },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(201).json({ user, token });
    } catch (err) {
      console.error("🔥 REGISTER ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* ======================================================
   LOGIN (EMAIL + PASSWORD)
   POST /api/auth/login
   ====================================================== */
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password)
        return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        user: { id: user.id, email: user.email, name: user.name },
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* ======================================================
   GOOGLE LOGIN
   POST /api/auth/google
   ====================================================== */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "idToken missing" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email)
      return res.status(401).json({ message: "Invalid Google token" });

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatarUrl: picture,
          provider: "google",
          password: null,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (err) {
    console.error("🔥 GOOGLE AUTH ERROR:", err);
    return res.status(401).json({ message: "Google authentication failed" });
  }
});

/* ======================================================
   APPLE LOGIN
   POST /api/auth/apple
   ====================================================== */
router.post("/apple", async (req, res) => {
  try {
    const { identityToken } = req.body;
    if (!identityToken)
      return res.status(400).json({ message: "identityToken missing" });

    const decoded = jwt.decode(identityToken);
    const email = decoded?.email;

    if (!email)
      return res.status(400).json({ message: "Apple email not available" });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: "Apple User",
          provider: "apple",
          password: null,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("🔥 APPLE AUTH ERROR:", err);
    return res.status(401).json({ message: "Apple authentication failed" });
  }
});

/* ======================================================
   🔥 GET CURRENT USER (TOKEN RESTORE)
   GET /api/me
   ====================================================== */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user)
      return res.status(401).json({ message: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("❌ /me error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
