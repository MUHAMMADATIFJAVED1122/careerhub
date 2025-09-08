import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { deleteMessage } from "../../services/chatService";
import {
  Phone,
  Video,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import "./chat.css";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { userId } = useParams();
  const senderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [receiverTyping, setReceiverTyping] = useState(false);

  // 🔹 For message action menu
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch user + messages
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReceiverInfo(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChat(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchUser();
    fetchMessages();
  }, [userId, token]);

  // Socket events
  useEffect(() => {
    if (!senderId) return;
    socket.emit("join", senderId);

    socket.on("receiveMessage", (data) => {
      if (
        (data.senderId === senderId && data.receiverId === userId) ||
        (data.senderId === userId && data.receiverId === senderId)
      ) {
        setChat((prev) => {
          const exists = prev.find((m) => m._id === data._id);
          if (exists) return prev.map((m) => (m._id === data._id ? data : m));
          return [...prev, data];
        });

        if (data.receiverId === senderId) {
          socket.emit("messageSeen", {
            messageIds: [data._id],
            senderId: data.senderId,
          });
        }
      }
    });

    socket.on("messageDelivered", ({ _id }) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === _id ? { ...msg, status: "delivered" } : msg
        )
      );
    });

    socket.on("messageSeen", ({ messageIds }) => {
      setChat((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, status: "seen" } : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageDelivered");
      socket.off("messageSeen");
    };
  }, [senderId, userId]);

  // Send Message
  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { receiverId: userId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChat((prev) => [...prev, { ...res.data, status: "sent" }]);
      socket.emit("sendMessage", res.data);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Delete options
  const deleteForMe = (id) => {
    setChat((prev) => prev.filter((msg) => msg._id !== id));
    setSelectedMessage(null);
  };

  const deleteEverywhere = async (id) => {
    try {
      await deleteMessage(token, id);
      setChat((prev) => prev.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  let typingTimeout;
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { senderId, receiverId: userId });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { senderId, receiverId: userId });
    }, 1500);
  };

  const handleCall = (type) => {
    navigate(`/call/${userId}?type=${type}`, {
      state: { receiverName: receiverInfo?.username },
    });
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <img
          src={receiverInfo?.profilePicture || "/default-avatar.png"}
          alt={receiverInfo?.username}
          className="chat-avatar"
        />
        <h2 className="chat-username">{receiverInfo?.username || "Chat"}</h2>

        <div className="chat-actions">
          <button onClick={() => handleCall("audio")}>
            <Phone size={20} />
          </button>
          <button onClick={() => handleCall("video")}>
            <Video size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {chat.map((msg) => (
          <div
            key={msg._id}
            className={`chat-message ${
              msg.senderId === senderId ? "sent" : "received"
            }`}
            onClick={() => setSelectedMessage(msg)} // 🔹 click to open menu
          >
            <span>{msg.message}</span>

            {msg.senderId === senderId && (
              <span className="chat-status">
                {msg.status === "seen" ? (
                  <CheckCheck size={14} color="green" />
                ) : msg.status === "delivered" ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={14} />
                )}
              </span>
            )}

            {/* 🔹 Action menu */}
            {selectedMessage?._id === msg._id && (
              <div className="message-menu">
                <button onClick={() => deleteForMe(msg._id)}>🗑️ Delete for Me</button>
                <button onClick={() => deleteEverywhere(msg._id)}>🔥 Delete Everywhere</button>
                <button onClick={() => setSelectedMessage(null)}>❌ Cancel</button>
              </div>
            )}
          </div>
        ))}
        {receiverTyping && <div className="chat-typing">Typing...</div>}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
