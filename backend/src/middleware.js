import crypto from "crypto";
import { findUserByEmail, sanitizeUser } from "./lib/models/user.js";

const TOKEN_EXPIRY_MS = 1000 * 60 * 60 * 8;

function getTokenSecret() {
  return process.env.AUTH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET || "hrms-development-secret";
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", getTokenSecret())
    .update(payload)
    .digest("base64url");
}

export function createAuthToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      exp: Date.now() + TOKEN_EXPIRY_MS,
    })
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

export async function verifyAuthToken(req, res, next) {
  try {
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    const [payload, signature] = token.split(".");
    if (!payload || !signature || signPayload(payload) !== signature) {
      return res.status(401).json({ success: false, message: "Invalid auth token." });
    }

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!decoded.exp || decoded.exp < Date.now()) {
      return res.status(401).json({ success: false, message: "Auth token expired." });
    }

    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid auth token." });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Token verification failed." });
  }
}
