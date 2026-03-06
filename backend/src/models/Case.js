import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contentType: { type: String, enum: ["email", "sms", "website"], required: true },
    content: { type: String, required: true },
    senderInfo: { type: String, default: "" },
    links: [{ type: String }],
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    correctAnswer: { type: String, enum: ["scam", "safe"], required: true },
    explanation: { type: String, required: true },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalVotes: { type: Number, default: 0 },
    correctVotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const CaseModel = mongoose.model("Case", caseSchema);
