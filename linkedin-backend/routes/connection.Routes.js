import express from "express";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/connection.Controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"; // ✅ your JWT middleware

const connectionRouter = express.Router();

// POST /api/connections/:id/follow
connectionRouter.post("/:id/follow", authMiddleware, followUser);

// POST /api/connections/:id/unfollow
connectionRouter.post("/:id/unfollow", authMiddleware, unfollowUser);

// GET /api/connections/:id/followers
connectionRouter.get("/:id/followers", getFollowers);

// GET /api/connections/:id/following
connectionRouter.get("/:id/following", getFollowing);

export default connectionRouter;
