import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Vote } from "../models/Vote.js";
import { Comment } from "../models/Comment.js";
import { CaseModel } from "../models/Case.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const [userVotes, commentsCount, publishedCasesCount] = await Promise.all([
    Vote.find({ userId: req.user._id })
      .populate("caseId", "title difficulty contentType")
      .sort({ createdAt: -1 })
      .lean(),
    Comment.countDocuments({ userId: req.user._id }),
    CaseModel.countDocuments({ isPublished: true }),
  ]);

  const recentVotes = userVotes.slice(0, 6);

  const progressPercent = publishedCasesCount
    ? Math.round((req.user.completedCases.length / publishedCasesCount) * 100)
    : 0;

  const streakWindow = recentVotes.slice(0, 5);
  const confidenceScore = Math.min(
    100,
    Math.round(req.user.accuracyRate * 0.7 + Math.min(req.user.totalVotes, 30) * 1),
  );

  const difficultyBreakdown = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  };

  for (const vote of userVotes) {
    const difficulty = vote.caseId?.difficulty;
    if (!difficultyBreakdown[difficulty]) continue;
    difficultyBreakdown[difficulty].total += 1;
    if (vote.isCorrect) difficultyBreakdown[difficulty].correct += 1;
  }

  return res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isEmailVerified: req.user.isEmailVerified,
      role: req.user.role,
      reputationScore: req.user.reputationScore,
      level: req.user.level,
      accuracyRate: req.user.accuracyRate,
      totalVotes: req.user.totalVotes,
      correctVotes: req.user.correctVotes,
      completedCasesCount: req.user.completedCases.length,
      badges: req.user.badges,
      commentsCount,
      progressPercent,
      confidenceScore,
      remainingCasesCount: Math.max(0, publishedCasesCount - req.user.completedCases.length),
      recentPerformance: streakWindow.map((vote) => ({
        id: vote._id,
        isCorrect: vote.isCorrect,
        answer: vote.answer,
        pointsAwarded: vote.pointsAwarded,
        createdAt: vote.createdAt,
        caseTitle: vote.caseId?.title || "Unknown case",
        difficulty: vote.caseId?.difficulty || "unknown",
        contentType: vote.caseId?.contentType || "unknown",
      })),
      difficultyBreakdown: Object.entries(difficultyBreakdown).map(([difficulty, stats]) => ({
        difficulty,
        total: stats.total,
        correct: stats.correct,
        accuracyRate: stats.total ? Math.round((stats.correct / stats.total) * 100) : 0,
      })),
    },
  });
});

export default router;
