// top of src/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// <-- replace your current generated-folder import with this:
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();


// Create Express app
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully! 🚀");
});

// Optional test route to check DB connection
app.get("/test-db", async (req, res) => {
  try {
    const time = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ success: true, serverTime: time });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
