import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { startCall, endCall, getCallHistory } from "../controllers/call.controller.js";

const callRouter = express.Router();

callRouter.post("/", authMiddleware, startCall);         // Start new call
callRouter.put("/:id/end", authMiddleware, endCall);     // End call
callRouter.get("/history", authMiddleware, getCallHistory); // Get call history

export default callRouter;
