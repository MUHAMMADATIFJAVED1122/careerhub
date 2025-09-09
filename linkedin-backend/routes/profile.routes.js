import express from "express";
import { getProfile, updateProfile, getProfileById } from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/profileupload.middleware.js";

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, getProfile);

profileRouter.put(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  updateProfile
);

profileRouter.get("/:id", authMiddleware, getProfileById);

export default profileRouter;
