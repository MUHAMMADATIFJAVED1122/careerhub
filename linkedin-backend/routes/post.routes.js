import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteComment,
  getMyPosts,
  getPostById,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import postUpload from "../middlewares/postupload.middleware.js"; // ✅ use new middleware

const postRouter = express.Router();

// Create post with image
postRouter.post("/", authMiddleware, postUpload.single("image"), createPost);

// Get all posts
postRouter.get("/", getAllPosts);

// Get posts by user id
postRouter.get("/user/:id", authMiddleware, getPostsByUser);

// Update post with image
postRouter.put("/:id", authMiddleware, postUpload.single("image"), updatePost);

// Delete post
postRouter.delete("/:id", authMiddleware, deletePost);

// Delete a comment
postRouter.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);

// Like / Unlike post
postRouter.post("/like/:id", authMiddleware, likePost);

// Add comment
postRouter.post("/comment/:id", authMiddleware, commentPost);

// Get my posts
postRouter.get("/my-posts", authMiddleware, getMyPosts);

// Get single post by id
postRouter.get("/:id", getPostById);

export default postRouter;
