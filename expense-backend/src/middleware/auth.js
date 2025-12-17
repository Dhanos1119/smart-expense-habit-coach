import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

console.log("[AUTH] Using JWT_SECRET:", JWT_SECRET.slice(0, 5) + "...");

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("[AUTH] Incoming Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Token format error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Malformed token" });
  }

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.userId = payload.userId;
    return next();
  } catch (err) {
    console.log("[AUTH] ❌ Verify error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
