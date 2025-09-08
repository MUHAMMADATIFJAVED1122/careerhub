// src/components/posts/Posts.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../authContext";
import { getAllPosts } from "../../services/postService";
import axios from "axios";

// MUI
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";

import "./Posts.css";

const Posts = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [safeUserId, setSafeUserId] = useState(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Like & Comment state
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  // Dropdown Menu handlers
  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  // Resolve logged-in userId
  useEffect(() => {
    let userId = null;

    if (typeof currentUser === "string") userId = currentUser;
    else if (currentUser?._id) userId = currentUser._id;

    if (!userId) {
      const fromLocalStorage = localStorage.getItem("userId");
      if (fromLocalStorage) userId = fromLocalStorage;
    }

    if (!userId) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          userId = parsed?._id || parsed?.id || parsed;
        }
      } catch (err) {
        console.warn("Failed to parse localStorage.user", err);
      }
    }

    if (userId) setSafeUserId(String(userId));
    else console.warn("⚠️ Could not resolve userId for ownership check");
  }, [currentUser]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();
        setPosts(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching posts:", err?.response?.data || err.message);
      }
    };
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a post.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      handleMenuClose();
      console.log("Post deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Delete failed. Make sure you are the post owner.");
    }
  };

  // Like post
  const toggleLike = (postId) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Add comment
  const handleComment = (postId) => {
    if (!newComment[postId]?.trim()) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment[postId]],
    }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="posts-wrapper">
      <Typography variant="h5" className="posts-title">
        Posts
      </Typography>

      {posts.length === 0 && (
        <Typography color="text.secondary">No posts yet.</Typography>
      )}

      {posts.map((post) => {
        const authorId =
          typeof post.author === "object" ? post.author?._id : post.author;

        const isOwner =
          safeUserId && authorId && String(safeUserId) === String(authorId);

        return (
          <Card key={post._id} className="post-card">
            <CardHeader
              avatar={
                <Avatar
                  src={
                    typeof post.author === "object"
                      ? post.author.profilePicture || "/default-avatar.png"
                      : "/default-avatar.png"
                  }
                />
              }
              title={
                <Typography variant="subtitle1" className="post-author">
                  {typeof post.author === "object"
                    ? post.author.username
                    : post.author}
                </Typography>
              }
              subheader={
                post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Just now"
              }
              action={
                <IconButton onClick={(e) => handleMenuOpen(e, post)}>
                  <MoreVertIcon />
                </IconButton>
              }
            />

            <CardContent>
              <Typography variant="body1" className="post-content">
                {post.content}
              </Typography>

              {post.image && (
                <div className="post-imageWrapper">
                  <img src={post.image} alt="Post" className="post-image" />
                </div>
              )}
            </CardContent>

            <CardActions disableSpacing className="post-actions">
              <IconButton onClick={() => toggleLike(post._id)}>
                {likes[post._id] ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2">
                {likes[post._id] ? "1 Like" : "0 Likes"}
              </Typography>

              <IconButton>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="body2">
                {(comments[post._id] || []).length} Comments
              </Typography>
            </CardActions>

            {/* Comment Section */}
            <div className="post-comments">
              <Divider className="post-divider" />
              {(comments[post._id] || []).map((c, idx) => (
                <Typography key={idx} variant="body2" className="comment-text">
                  💬 {c}
                </Typography>
              ))}

              <div className="comment-box">
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Write a comment..."
                  value={newComment[post._id] || ""}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() => handleComment(post._id)}
                  variant="contained"
                  className="comment-btn"
                >
                  Comment
                </Button>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedPost && safeUserId && (
          <>
            {String(selectedPost.author?._id || selectedPost.author) ===
            String(safeUserId) ? (
              <>
                <MenuItem
                  onClick={() => {
                    alert("Edit not yet implemented");
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (selectedPost) handleDelete(selectedPost._id);
                  }}
                  className="delete-menuItem"
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => {
                  alert("Post reported!");
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <FlagIcon fontSize="small" color="warning" />
                </ListItemIcon>
                Report
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};

export default Posts;
