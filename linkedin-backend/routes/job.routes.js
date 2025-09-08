import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import jobUpload from "../middlewares/jobupload.middleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  likeJob,
  commentJob,
  deleteComment,
} from "../controllers/job.controller.js";

const jobRouter = express.Router();

// Create job (with image upload)
jobRouter.post("/", authMiddleware, jobUpload.single("jobImage"), createJob);

// Get all jobs
jobRouter.get("/", getJobs);

// Get single job
jobRouter.get("/:id", getJobById);

// Update job (with image upload)
jobRouter.put("/:id", authMiddleware, jobUpload.single("jobImage"), updateJob);

// Delete job
jobRouter.delete("/:id", authMiddleware, deleteJob);

// Likes + Comments
jobRouter.put("/:id/like", authMiddleware, likeJob);
jobRouter.post("/:id/comment", authMiddleware, commentJob);
jobRouter.delete("/:jobId/comment/:commentId", authMiddleware, deleteComment);

export default jobRouter;
