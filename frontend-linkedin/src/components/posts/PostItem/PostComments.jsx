import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { normalizeId } from "../../../utils/normalizeId";

const PostComments = ({ comments, setComments, postId, safeUserId, token }) => {
  const [visibleCount, setVisibleCount] = useState(2); // Show only 2 comments first

  const handleDeleteComment = async (commentId) => {
    if (!token) return alert("Login to delete comment");
    try {
      await axios.delete(
        `http://localhost:5000/api/posts/comment/${postId}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  if (comments.length === 0) return null;

  return (
    <div className="post-comments mt-2">
      <b>Comments:</b>
      {comments.slice(0, visibleCount).map((c) => {
        const isCommentOwner =
          normalizeId(safeUserId) === normalizeId(c.user?._id || c.user);

        return (
          <div key={c._id} className="post-comment d-flex align-items-center py-2 border-bottom">
            {/* Avatar */}
            <Link to={`/profile/${normalizeId(c.user?._id)}`}>
              <img
                src={
                  c.user?.profilePicture
                    ? c.user.profilePicture.startsWith("http")
                      ? c.user.profilePicture
                      : `http://localhost:5000${c.user.profilePicture}`
                    : "/default-avatar.png"
                }
                alt={c.user?.username}
                className="rounded-circle me-2"
                style={{ width: "32px", height: "32px", objectFit: "cover" }}
              />
            </Link>

            {/* Username + Comment */}
            <div className="flex-grow-1">
              <b>
                <Link
                  to={`/profile/${normalizeId(c.user?._id)}`}
                  className="text-dark text-decoration-none"
                >
                  {c.user?.username}
                </Link>
              </b>
              : {c.text}
            </div>

            {/* Delete button (if owner) */}
            {isCommentOwner && (
              <button
                onClick={() => handleDeleteComment(c._id)}
                className="btn btn-link text-danger p-0 ms-2"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}

      {/* See more button */}
      {visibleCount < comments.length && (
        <div className="text-center mt-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setVisibleCount(visibleCount + 2)}
          >
            See more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default PostComments;
