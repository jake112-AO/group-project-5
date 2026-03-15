import mongoose from "mongoose";

const leaderboardGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export const LeaderboardGroup = mongoose.model("LeaderboardGroup", leaderboardGroupSchema);
