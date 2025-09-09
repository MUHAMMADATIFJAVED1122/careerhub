import React, { useState } from "react";
import axios from "axios";

const PostContent = ({ post, editing, setEditing, onUpdate, token }) => {
  const [editData, setEditData] = useState({
    content: post.content,
    image: null,
  });

  const handleSave = async () => {
    if (!token) return alert("You must be logged in to edit a post.");
    try {
      const formData = new FormData();
      formData.append("content", editData.content);
      if (editData.image) formData.append("image", editData.image);

      const res = await axios.put(
        `https://careerhubbackend-qnhl.onrender.com/api/posts/${post._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(res.data.post);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Edit failed.");
    }
  };

  if (editing) {
    return (
      <div className="mb-2">
        <textarea
          className="form-control mb-2"
          value={editData.content}
          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
        />
        <button onClick={handleSave} className="btn btn-sm btn-success me-2">Save</button>
        <button onClick={() => setEditing(false)} className="btn btn-sm btn-secondary">Cancel</button>
      </div>
    );
  }

  return (
    <div className="post-content">
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="post" />}
    </div>
  );
};

export default PostContent;
