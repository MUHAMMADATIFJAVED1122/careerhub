// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../posts/CreatePost";
import PostItem from "../posts/PostItem/PostItem";
import Header from "../layout/Header"; // ✅ top navbar

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [safeUserId, setSafeUserId] = useState(null);
  const [token, setToken] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://careerhubbackend-qnhl.onrender.com/api/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching posts:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    let userId = storedUserId || null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        userId = parsed?._id || parsed?.id || userId;
      } catch (err) {
        console.warn("Could not parse localStorage 'user':", storedUser);
      }
    }

    if (userId) setSafeUserId(String(userId));
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <>
      <Header /> {/* ✅ Navbar fixed on top */}
      <div
        className="dashboard-container"
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "0 15px",
        }}
      >
        {/* Create post box at top */}
        <CreatePost
          onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-muted mt-3">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              safeUserId={safeUserId}
              token={token}
              onDelete={(id) =>
                setPosts((prev) => prev.filter((p) => p._id !== id))
              }
              onUpdate={(updatedPost) =>
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === updatedPost._id ? updatedPost : p
                  )
                )
              }
            />
          ))
        )}
      </div>
    </>
  );
};

export default Dashboard;
