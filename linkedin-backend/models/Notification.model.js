// models/Notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // 👈 NEW (for like/comment)
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
