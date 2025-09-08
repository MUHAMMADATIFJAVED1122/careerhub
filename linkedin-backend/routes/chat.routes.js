import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getChatUsers,
  getUserInfo,
  sendMessage,
  deleteMessage,
  getMessages,
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/users", authMiddleware, getChatUsers);
chatRouter.get("/user/:id", authMiddleware, getUserInfo);
chatRouter.post("/", authMiddleware, sendMessage);
chatRouter.delete("/:id", authMiddleware, deleteMessage);
chatRouter.get("/:userId", authMiddleware, getMessages);

export default chatRouter;
