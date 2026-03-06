import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    answer: { type: String, enum: ["scam", "safe", "unsure"], required: true },
    isCorrect: { type: Boolean, required: true },
    pointsAwarded: { type: Number, required: true },
  },
  { timestamps: true },
);

voteSchema.index({ userId: 1, caseId: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
