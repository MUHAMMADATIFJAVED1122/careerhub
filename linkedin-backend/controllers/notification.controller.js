// controllers/notification.controller.js
import Notification from "../models/Notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: req.user._id })
      .populate("fromUser", "username email profilePicture") // 👈 important
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { toUser: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
