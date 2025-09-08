import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { followUser, unfollowUser, getFollowing } from "../../../services/connectionService";
import { normalizeId } from "../../../utils/normalizeId";

const PostHeader = ({ post, safeUserId, token }) => {
  const authorId = normalizeId(post.author?._id || post.author);
  const normalizedSafeUserId = normalizeId(safeUserId);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwner = normalizedSafeUserId && authorId && normalizedSafeUserId === authorId;

  useEffect(() => {
    const init = async () => {
      try {
        if (!normalizedSafeUserId || !authorId || isOwner) return;
        const following = await getFollowing(normalizedSafeUserId);
        setIsFollowing(following.some(u => normalizeId(u._id) === authorId));
      } catch {}
    };
    init();
  }, [normalizedSafeUserId, authorId, isOwner]);

  const toggleFollow = async () => {
    if (!token) return alert("Login to follow users");
    try {
      if (isFollowing) {
        await unfollowUser(token, authorId);
        setIsFollowing(false);
      } else {
        await followUser(token, authorId);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error("follow/unfollow failed", e);
    }
  };

  return (
    <div className="post-header">
      <div className="post-header-left">
        <Link to={`/profile/${normalizeId(post.author?._id)}`} className="d-flex align-items-center text-dark text-decoration-none">
          <img
            src={post.author?.profilePicture || "/default-avatar.png"}
            alt={post.author?.username}
          />
          <h5 className="m-0">{post.author?.username || post.author}</h5>
        </Link>
      </div>

      {!isOwner && authorId && (
        <button onClick={toggleFollow} className="btn btn-sm btn-outline-primary">
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default PostHeader;
