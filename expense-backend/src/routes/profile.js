import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `avatar-${req.user.userId}.${ext}`);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    const avatarUrl = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { avatarUrl },
    });

    res.json({ avatarUrl });
  }
);

export default router;
