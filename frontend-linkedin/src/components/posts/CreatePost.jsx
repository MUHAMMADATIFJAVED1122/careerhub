// src/components/posts/CreatePost.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import { Image as ImageIcon, Send as SendIcon } from "@mui/icons-material";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await axios.post("https://careerhubbackend-qnhl.onrender.com/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      const input = document.getElementById("postImageInput");
      if (input) input.value = "";

      if (onPostCreated) onPostCreated(res.data.post);
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Failed to create post");
    }
  };

  return (
    <Card className="create-post-card">
      <CardContent className="create-post-cardContent">
        <div className="create-post-header">
          <Avatar src="/default-avatar.png" />
          <Typography variant="h6" className="create-post-title">
            Create Post
          </Typography>
        </div>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <TextField
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            variant="outlined"
            className="create-post-textfield"
          />

          {image && (
            <div className="create-post-previewWrapper">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="create-post-previewImage"
              />
            </div>
          )}

          <div className="create-post-actions">
            <input
              type="file"
              id="postImageInput"
              accept="image/*"
              className="visually-hidden-input"
              onChange={(e) => setImage(e.target.files && e.target.files[0])}
            />
            <label htmlFor="postImageInput" className="create-post-imageLabel">
              <IconButton component="span" color="primary">
                <ImageIcon />
              </IconButton>
              <span className="create-post-imageText">Add image</span>
            </label>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
            >
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
