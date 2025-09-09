// src/components/ChatIcon.jsx
import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ChatIcon.css"; // Import styles

const ChatIcon = () => {
  const token = localStorage.getItem("token");
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);

  // Fetch chat users
  useEffect(() => {
    if (!token) return;
    const fetchChatUsers = async () => {
      try {
        const res = await axios.get("https://careerhubbackend-qnhl.onrender.com/api/chat/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching chat users:", err);
      }
    };
    fetchChatUsers();
  }, [token]);

  return (
    <div className="chat-icon-container">
      {/* 💬 Chat Button */}
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="chat-icon-btn"
      >
        <MessageSquare size={22} />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="chat-dropdown">
          <div className="chat-dropdown-header">Chats</div>

          {chatUsers.length === 0 ? (
            <div className="chat-empty">No chats yet</div>
          ) : (
            chatUsers.map((user) => (
              <Link
                to={`/chat/${user._id}`}
                key={user._id}
                className="chat-user-item"
              >
                <div className="chat-avatar-wrapper">
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={user.username}
                    className="chat-avatar"
                  />
                  <span
                    className={`status-dot ${
                      user.online ? "online" : "offline"
                    }`}
                  ></span>
                </div>
                <span className="chat-username">{user.username}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
