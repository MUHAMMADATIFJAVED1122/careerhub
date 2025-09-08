// models/job.model.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    applyLink: { type: String },
    jobImage: { type: String }, // ✅ Job picture / company logo

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ like/unlike
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
