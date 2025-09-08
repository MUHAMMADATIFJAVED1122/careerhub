import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.Controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.put("/:id/read", authMiddleware, markAsRead);
notificationRouter.put("/read/all", authMiddleware, markAllAsRead);

export default notificationRouter;
