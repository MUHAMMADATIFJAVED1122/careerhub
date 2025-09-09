import React, { useState } from "react";
import { likePost, deletePost } from "../../../services/postService";
import { normalizeId } from "../../../utils/normalizeId";

const PostActions = ({
  post,
  likesCount,
  setLikesCount,
  liked,
  setLiked,
  editing,
  setEditing,
  safeUserId,
  token,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = normalizeId(safeUserId) === normalizeId(post.author?._id);

  const handleLike = async () => {
    if (!token) return alert("Login to like post");
    try {
      const res = await likePost(token, post._id);
      // assuming res.likes returns updated count
      setLikesCount(res.likes);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
      alert("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (!token) return alert("You must be logged in to delete a post.");
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(token, post._id);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
      alert("Delete failed. Make sure you are the post owner.");
    }
  };

  return (
    <div className="post-actions d-flex align-items-center justify-content-between my-2">
      {/* ❤️ Like button */}
      <button
        onClick={handleLike}
        className={`btn btn-sm ${liked ? "btn-danger" : "btn-outline-danger"}`}
      >
        {liked ? "❤️ Liked" : "🤍 Like"} ({likesCount})
      </button>

      {/* 3-dot menu for owner */}
      {isOwner && (
        <div className="position-relative">
        <button
  className="btn btn-sm btn-dark"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ⋮
</button>


          {menuOpen && (
            <div
              className="dropdown-menu show"
              style={{ position: "absolute", right: 0 }}
            >
              {!editing && (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit
                </button>
              )}
              <button
                className="dropdown-item text-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostActions;
