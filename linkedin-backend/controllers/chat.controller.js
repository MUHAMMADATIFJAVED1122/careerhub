import Message from "../models/chat.model.js";
import User from "../models/User.model.js";

// Get all users that current user has chatted with
export const getChatUsers = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
    }).populate("senderId receiverId", "username profilePicture");

    const users = [];
    const userMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId._id.toString() === req.user.id
          ? msg.receiverId
          : msg.senderId;

      if (!userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), otherUser);
        users.push(otherUser);
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat users" });
  }
};

// Get chat header info (username + profilePic)
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username profilePicture"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};

// Save a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      message,
      status: "sent", // ✅ status added
    });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this message" });
    }

    await message.deleteOne();
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// Get all messages between two users
// export const getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({
//       $or: [
//         { senderId: req.user.id, receiverId: req.params.userId },
//         { senderId: req.params.userId, receiverId: req.user.id },
//       ],
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// };
// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    // 🔥 Auto mark delivered/sent messages as seen when user opens chat
    const unseenMessages = messages.filter(
      (msg) =>
        msg.receiverId.toString() === req.user.id &&
        ["sent", "delivered"].includes(msg.status)
    );

    if (unseenMessages.length > 0) {
      const ids = unseenMessages.map((m) => m._id);
      await Message.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "seen" } }
      );

      // Update local copy so sender sees ✅✅ immediately
      unseenMessages.forEach((msg) => (msg.status = "seen"));
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ✅ Update status to "delivered"
export const markAsDelivered = async (req, res) => {
  try {
    const { messageIds } = req.body;
    await Message.updateMany(
      { _id: { $in: messageIds }, status: "sent" },
      { $set: { status: "delivered" } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update messages to delivered" });
  }
};

// ✅ Update status to "seen"
export const markAsSeen = async (req, res) => {
  try {
    const { messageIds } = req.body;
    await Message.updateMany(
      { _id: { $in: messageIds }, status: { $in: ["sent", "delivered"] } },
      { $set: { status: "seen" } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update messages to seen" });
  }
};
