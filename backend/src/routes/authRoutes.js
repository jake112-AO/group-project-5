import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function sign(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email, password are required" });
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
  });
  if (existing) {
    return res.status(409).json({ error: "Email or username already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase(),
    passwordHash,
    role: "user",
  });

  const token = sign(user._id.toString());
  return res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = sign(user._id.toString());
  return res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      reputationScore: req.user.reputationScore,
      level: req.user.level,
      accuracyRate: req.user.accuracyRate,
      totalVotes: req.user.totalVotes,
      badges: req.user.badges,
    },
  });
});

export default router;
