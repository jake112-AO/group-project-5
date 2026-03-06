import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

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
      correctVotes: req.user.correctVotes,
      completedCasesCount: req.user.completedCases.length,
      badges: req.user.badges,
    },
  });
});

export default router;
