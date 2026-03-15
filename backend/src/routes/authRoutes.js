import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { PendingSignup } from "../models/PendingSignup.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { createVerificationCode, hashVerificationCode } from "../utils/verificationCode.js";
import { sendVerificationCodeEmail } from "../services/emailService.js";

const router = express.Router();

function sign(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
}

function serializeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

async function clearExpiredPendingSignups() {
  await PendingSignup.deleteMany({ expiresAt: { $lt: new Date() } });
}

async function sendCodeAndStorePendingSignup({ username, email, passwordHash }) {
  const { code, codeHash, expiresAt } = createVerificationCode();

  await PendingSignup.findOneAndUpdate(
    { email },
    {
      username,
      email,
      passwordHash,
      verificationCodeHash: codeHash,
      expiresAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await sendVerificationCodeEmail({
    email,
    username,
    code,
  });
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email, password are required" });
  }

  await clearExpiredPendingSignups();

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();

  const [existingUserByEmail, existingUserByUsername, pendingByUsername] = await Promise.all([
    User.findOne({ email: normalizedEmail }).lean(),
    User.findOne({ username: normalizedUsername }).lean(),
    PendingSignup.findOne({
      username: normalizedUsername,
      email: { $ne: normalizedEmail },
      expiresAt: { $gt: new Date() },
    }).lean(),
  ]);

  if (existingUserByEmail || existingUserByUsername || pendingByUsername) {
    return res.status(409).json({ error: "Email or username already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await sendCodeAndStorePendingSignup({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });
  } catch {
    return res.status(500).json({ error: "Could not send verification code. Please try again." });
  }

  return res.status(201).json({
    message: "Verification code sent. Enter the 6-digit code to finish registration.",
    email: normalizedEmail,
    username: normalizedUsername,
  });
});

router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "email and code are required" });
  }

  await clearExpiredPendingSignups();

  const normalizedEmail = email.toLowerCase().trim();
  const pending = await PendingSignup.findOne({ email: normalizedEmail });

  if (!pending) {
    return res.status(404).json({ error: "Verification session not found or expired" });
  }

  const codeHash = hashVerificationCode(code);
  if (pending.verificationCodeHash !== codeHash) {
    return res.status(400).json({ error: "Verification code is incorrect" });
  }

  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email: pending.email }).lean(),
    User.findOne({ username: pending.username }).lean(),
  ]);

  if (existingEmail || existingUsername) {
    await PendingSignup.deleteOne({ _id: pending._id });
    return res.status(409).json({ error: "Email or username already in use" });
  }

  const user = await User.create({
    username: pending.username,
    email: pending.email,
    passwordHash: pending.passwordHash,
    role: "user",
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    emailVerificationTokenHash: null,
    emailVerificationExpiresAt: null,
  });

  await PendingSignup.deleteOne({ _id: pending._id });

  return res.status(201).json({
    message: "Email verified. Your account is ready.",
    user: serializeUser(user),
  });
});

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  await clearExpiredPendingSignups();

  const normalizedEmail = email.toLowerCase().trim();
  const pending = await PendingSignup.findOne({ email: normalizedEmail });
  if (!pending) {
    return res.status(404).json({ error: "No pending signup found for that email" });
  }

  try {
    await sendCodeAndStorePendingSignup({
      username: pending.username,
      email: pending.email,
      passwordHash: pending.passwordHash,
    });
    return res.json({ message: "Verification code sent" });
  } catch {
    return res.status(500).json({ error: "Could not resend verification code" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = sign(user._id.toString());
  return res.json({
    token,
    user: serializeUser(user),
  });
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({
    user: {
      ...serializeUser(req.user),
      reputationScore: req.user.reputationScore,
      level: req.user.level,
      accuracyRate: req.user.accuracyRate,
      totalVotes: req.user.totalVotes,
      badges: req.user.badges,
    },
  });
});

export default router;
