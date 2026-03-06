import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    body: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
