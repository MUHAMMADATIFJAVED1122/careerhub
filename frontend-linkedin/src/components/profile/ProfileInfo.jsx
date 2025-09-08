import React from "react";
import { Link } from "react-router-dom";
import "./ProfileInfo.css";

const ProfileInfo = ({
  profile,
  followers,
  following,
  isOwnProfile,
  iFollowThisUser,
  toggleFollowProfile,
  setEditing,
}) => (
  <div className="profile-info-container">
    <div className="profile-info-main">
      <div className="profile-info-left">
        <h2>{profile.username}</h2>
        <p>{profile.email}</p>
        <p>
          <b>Bio:</b> {profile.bio || "No bio yet"}
        </p>
        <p>
          <b>Location:</b> {profile.location || "Not set"}
        </p>
        <p>
          <b>Job Title:</b> {profile.jobTitle || "Not set"}
        </p>
        <p>
          <b>Company:</b> {profile.company || "Not set"}
        </p>
        <p>
          <b>Skills:</b> {profile.skills?.join(", ") || "Not set"}
        </p>

        {!isOwnProfile && (
          <div className="profile-info-buttons">
            <button className="follow-btn" onClick={toggleFollowProfile}>
              {iFollowThisUser ? "Unfollow" : "Follow"}
            </button>
            <Link to={`/chat/${profile._id}`}>
              <button className="chat-btn">Chat</button>
            </Link>
          </div>
        )}

        <div className="profile-info-follow">
          <div>
            <Link to={`/profile/${profile._id}/followers`}>Followers</Link>: {followers.length}
          </div>
          <div>
            <Link to={`/profile/${profile._id}/following`}>Following</Link>: {following.length}
          </div>
        </div>

        {isOwnProfile && (
          <button className="edit-profile-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProfileInfo;
