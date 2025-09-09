// import Job from "../models/job.model.js";

// Create job
// export const createJob = async (req, res) => {
//   try {
//     const jobData = { ...req.body, createdBy: req.user.id };

//     if (req.file) {
//       jobData.jobImage = `/uploads/jobs/${req.file.filename}`;
//     }

//     const job = new Job(jobData);
//     await job.save();
//     res.status(201).json(job);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Update job
// export const updateJob = async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     if (req.file) {
//       updateData.jobImage = `/uploads/jobs/${req.file.filename}`;
//     }

//     const job = await Job.findOneAndUpdate(
//       { _id: req.params.id, createdBy: req.user.id },
//       updateData,
//       { new: true }
//     ).populate("createdBy", "username profilePicture");

//     if (!job) {
//       return res.status(404).json({ error: "Job not found or not authorized" });
//     }

//     res.json(job);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "❌ Failed to update job" });
//   }
// };
import Job from "../models/Job.model.js";

// Create job
// export const createJob = async (req, res) => {
//   try {
//     const jobData = { ...req.body, createdBy: req.user.id };

//     if (req.file) {
//          jobData.jobImage = req.file.path; 
//     }

//     const job = new Job(jobData);
//     await job.save();
//     res.status(201).json(job);
//   } catch (err) {
//     console.error("❌ Job Create Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update job
// export const updateJob = async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     if (req.file) {
//         updateData.jobImage = req.file.path; 
//     }

//     const job = await Job.findOneAndUpdate(
//       { _id: req.params.id, createdBy: req.user.id },
//       updateData,
//       { new: true }
//     ).populate("createdBy", "username profilePicture");

//     if (!job) {
//       return res.status(404).json({ error: "Job not found or not authorized" });
//     }

//     res.json(job);
//   } catch (err) {
//     console.error("❌ Job Update Error:", err);
//     res.status(500).json({ error: "❌ Failed to update job" });
//   }
// };
// Create job
export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, createdBy: req.user.id };

    if (req.file) {
      // New uploaded file → Cloudinary URL or file path
      jobData.jobImage = req.file.path; 
    } else if (req.body.jobImage) {
      // If frontend sent a Cloudinary URL string
      jobData.jobImage = req.body.jobImage;
    }

    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Job Create Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // New file uploaded
      updateData.jobImage = req.file.path;
    } else if (req.body.jobImage) {
      // No file, but frontend sent Cloudinary URL
      updateData.jobImage = req.body.jobImage;
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updateData,
      { new: true }
    ).populate("createdBy", "username profilePicture");

    if (!job) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.json(job);
  } catch (err) {
    console.error("❌ Job Update Error:", err);
    res.status(500).json({ error: "❌ Failed to update job" });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "username profilePicture"
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found or not authorized" });
    }
    res.json({ message: "✅ Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like job
export const likeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const userId = req.user.id;
    let message = "";

    if (job.likes.includes(userId)) {
      job.likes = job.likes.filter((uid) => uid.toString() !== userId);
      message = "Job unliked";
    } else {
      job.likes.push(userId);
      message = "Job liked";
    }

    await job.save();
    res.json({ message, likesCount: job.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comment job
export const commentJob = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment cannot be empty" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const comment = { user: req.user.id, text };
    job.comments.push(comment);
    await job.save();

    const populatedJob = await Job.findById(req.params.id).populate(
      "comments.user",
      "username profilePicture"
    );
    const newComment = populatedJob.comments[populatedJob.comments.length - 1];

    res.json({ message: "Comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { jobId, commentId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const comment = job.comments.find((c) => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    job.comments = job.comments.filter((c) => c._id.toString() !== commentId);
    await job.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
