// src/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

console.log("[AUTH] Using JWT_SECRET:", JWT_SECRET.slice(0, 5) + "...");

/**
 * Middleware to protect routes.
 * Expects header: Authorization: Bearer <token>
 * Attaches req.userId from token payload.
 */
export function authenticateToken(req, res, next) {
  // Read Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("[AUTH] Incoming Header:", authHeader);

  if (!authHeader) {
    console.log("[AUTH] ❌ No token found");
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    console.log("[AUTH] ❌ Token format wrong");
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log("[AUTH] ❌ Scheme is not Bearer");
    return res.status(401).json({ message: "Malformed token" });
  }

  console.log("[AUTH] Token received:", token.slice(0, 25) + "...");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    console.log("[AUTH] ✔ Token valid. userId =", payload.userId);

    // Attach userId to request
    req.userId = payload.userId;
    return next();
  } catch (err) {
    console.log("[AUTH] ❌ Token verify error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
