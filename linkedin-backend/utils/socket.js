import { Server } from "socket.io";
import Message from "../models/chat.model.js";

let io;
let onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // ---------------- User Join ----------------
    socket.on("join", async (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("✅ User joined:", userId);

      // 🔥 Mark all undelivered messages as delivered when user comes online
      const undelivered = await Message.find({
        receiverId: userId,
        status: "sent",
      });

      if (undelivered.length > 0) {
        const ids = undelivered.map((m) => m._id);

        await Message.updateMany(
          { _id: { $in: ids } },
          { $set: { status: "delivered" } }
        );

        // notify senders instantly
        undelivered.forEach((msg) => {
          const senderSocket = onlineUsers.get(msg.senderId.toString());
          if (senderSocket) {
            io.to(senderSocket).emit("messageDelivered", { _id: msg._id });
          }
        });

        // 🔥 also update the receiver’s own UI
        io.to(socket.id).emit("messagesUpdated", {
          messageIds: ids,
          status: "delivered",
        });
      }
    });

    // ---------------- Chat ----------------
    socket.on("sendMessage", async ({ senderId, receiverId, message, _id }) => {
      const receiverSocket = onlineUsers.get(receiverId);

      const msg = { _id, senderId, receiverId, message, status: "sent" };

      // Save message with status = sent
      await Message.findByIdAndUpdate(_id, { status: "sent" });

      // send to receiver
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", msg);

        // update status to delivered
        await Message.findByIdAndUpdate(_id, { status: "delivered" });

        // notify sender that message is delivered
        io.to(socket.id).emit("messageDelivered", { _id });

        // 🔥 also update receiver’s UI
        io.to(receiverSocket).emit("messagesUpdated", {
          messageIds: [_id],
          status: "delivered",
        });
      }

      // echo back to sender for consistency
      io.to(socket.id).emit("receiveMessage", msg);
    });

    // ---------------- Seen ----------------
    socket.on("messageSeen", async ({ messageIds, senderId }) => {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { status: "seen" } }
      );

      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("messageSeen", { messageIds });
      }

      // 🔥 update receiver’s own UI too
      io.to(socket.id).emit("messagesUpdated", {
        messageIds,
        status: "seen",
      });
    });

    // ---------------- Typing ----------------
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { senderId });
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping", { senderId });
      }
    });

    // ---------------- Calls ----------------
    socket.on("callUser", ({ senderId, receiverId, offer, callType }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("incomingCall", {
          senderId,
          offer,
          callType,
        });
      }
    });

    socket.on("answerCall", ({ senderId, receiverId, answer }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("callAnswered", {
          senderId,
          answer,
        });
      }
    });

    socket.on("iceCandidate", ({ receiverId, candidate }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("iceCandidate", { candidate });
      }
    });

    socket.on("endCall", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("callEnded", { senderId });
      }
    });

    // ---------------- Disconnect ----------------
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
