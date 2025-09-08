import React, { useState } from "react";
import { commentPost } from "../../../services/postService";

const PostCommentForm = ({ postId, setComments, token }) => {
  const [commentText, setCommentText] = useState("");

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login to comment");
    if (!commentText.trim()) return;
    try {
      const newComment = await commentPost(token, postId, commentText);
      setComments(prev => [...prev, newComment]);
      setCommentText("");
    } catch {
      alert("Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleComment} className="post-comment-form">
      <input
        type="text"
        className="form-control"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit" className="btn btn-primary">Comment</button>
    </form>
  );
};

export default PostCommentForm;
