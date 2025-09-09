// src/components/layout/Header.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell } from "lucide-react";
import ChatIcon from "./ChatIcon";
import "./Header.css"; // ✅ Import CSS

const Header = () => {
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("https://careerhubbackend-qnhl.onrender.com/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err.response?.data || err);
      }
    };
    fetchNotifications();
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `https://careerhubbackend-qnhl.onrender.com/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        "https://careerhubbackend-qnhl.onrender.com/api/notifications/read/all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  // Helper to get notification text
  const getMessage = (n) => {
    const user = n.fromUser?.username || "Someone";
    switch (n.type) {
      case "follow":
        return (
          <>
            <Link to={`/profile/${n.fromUser?._id}`} className="notif-user">
              {user}
            </Link>{" "}
            started following you
          </>
        );
      case "like":
        return (
          <>
            <Link to={`/profile/${n.fromUser?._id}`} className="notif-user">
              {user}
            </Link>{" "}
            liked your post
          </>
        );
      case "comment":
        return (
          <>
            <Link to={`/profile/${n.fromUser?._id}`} className="notif-user">
              {user}
            </Link>{" "}
            commented on your post
          </>
        );
      default:
        return <>You have a new notification</>;
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/auth"; // redirect to login
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo">
         CareerHub
      </Link>

      <nav className="nav-links">
        <Link to="/profile">My Profile</Link>
        <Link to="/post-job">Post Job</Link>

        {/* 🔔 Bell */}
        <div className="notif-wrapper">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="notif-btn"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <strong>Notifications</strong>
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="notif-markall"
                >
                  Mark all read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="notif-empty">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-item ${n.read ? "read" : "unread"}`}
                  >
                    <div className="notif-msg">{getMessage(n)}</div>
                    <div className="notif-footer">
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="notif-mark"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <ChatIcon />

        {/* 🔓 Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
