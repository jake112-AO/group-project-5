import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find({})
    .sort({ reputationScore: -1, accuracyRate: -1, createdAt: 1 })
    .limit(50)
    .select("username reputationScore level accuracyRate totalVotes badges")
    .lean();

  return res.json({
    leaderboard: users.map((u, idx) => ({
      rank: idx + 1,
      id: u._id,
      username: u.username,
      reputationScore: u.reputationScore,
      level: u.level,
      accuracyRate: u.accuracyRate,
      totalVotes: u.totalVotes,
      badges: u.badges,
    })),
  });
});

export default router;
