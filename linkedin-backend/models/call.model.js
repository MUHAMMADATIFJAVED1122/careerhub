import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["ongoing", "ended", "missed"],
      default: "ongoing",
    },
    callType: {
      type: String,
      enum: ["audio", "video"],
      default: "video",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Call", callSchema);
