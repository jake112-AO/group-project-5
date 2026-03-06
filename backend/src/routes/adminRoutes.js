import express from "express";
import mongoose from "mongoose";
import { CaseModel } from "../models/Case.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/cases", async (req, res) => {
  const cases = await CaseModel.find({}).sort({ createdAt: -1 }).lean();
  return res.json({ cases });
});

router.post("/cases", async (req, res) => {
  const {
    title,
    contentType,
    content,
    senderInfo = "",
    links = [],
    difficulty = "easy",
    correctAnswer,
    explanation,
    tags = [],
    isPublished = false,
  } = req.body;

  if (!title || !contentType || !content || !correctAnswer || !explanation) {
    return res.status(400).json({ error: "Missing required case fields" });
  }

  const caseItem = await CaseModel.create({
    title,
    contentType,
    content,
    senderInfo,
    links,
    difficulty,
    correctAnswer,
    explanation,
    tags,
    isPublished,
    createdBy: req.user._id,
  });

  return res.status(201).json({ case: caseItem });
});

router.patch("/cases/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid case id" });
  }
  const caseItem = await CaseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!caseItem) return res.status(404).json({ error: "Case not found" });
  return res.json({ case: caseItem });
});

router.delete("/cases/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid case id" });
  }
  const deleted = await CaseModel.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Case not found" });
  return res.status(204).send();
});

export default router;
