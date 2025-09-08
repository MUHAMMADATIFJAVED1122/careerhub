import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import PostCommentForm from "./PostCommentForm";
import "./PostItem.css"; // ✅ one CSS file for all

const PostItem = ({ post, safeUserId, token, onDelete, onUpdate }) => {
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [comments, setComments] = useState(post.comments || []);
  const [editing, setEditing] = useState(false);

  return (
    <div className="post-item">
      <PostHeader post={post} safeUserId={safeUserId} token={token} />

      <PostContent
        post={post}
        editing={editing}
        setEditing={setEditing}
        onUpdate={onUpdate}
        token={token}
      />

      <PostActions
        post={post}
        likesCount={likesCount}
        setLikesCount={setLikesCount}
        liked={liked}
        setLiked={setLiked}
        editing={editing}
        setEditing={setEditing}
        safeUserId={safeUserId}
        token={token}
        onDelete={onDelete}
      />

      <PostComments
        comments={comments}
        setComments={setComments}
        postId={post._id}
        safeUserId={safeUserId}
        token={token}
      />

      <PostCommentForm
        postId={post._id}
        setComments={setComments}
        token={token}
      />

      <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default PostItem;
