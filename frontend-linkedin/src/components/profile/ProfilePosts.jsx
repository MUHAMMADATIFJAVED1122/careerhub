import React from "react";
import PostItem from "../posts/PostItem/PostItem";
import CreatePost from "../posts/CreatePost";

const ProfilePosts = ({ posts, setPosts, isOwnProfile, profile, safeUserId, token }) => (
  <div style={{ marginTop: "30px" }}>
    {isOwnProfile && (
      <div style={{ marginTop: "40px" }}>
       
        <CreatePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />
      </div>
    )}

    <h3>{isOwnProfile ? "My Feeds" : `${profile.username}'s Feeds`}</h3>
    {posts.length === 0 && <p>No posts yet.</p>}
    {posts.map((post) => (
      <PostItem
        key={post._id}
        post={post}
        safeUserId={safeUserId}
        token={token}
        onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
        onUpdate={(updatedPost) => setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)))}
      />
    ))}
  </div>
);

export default ProfilePosts;
