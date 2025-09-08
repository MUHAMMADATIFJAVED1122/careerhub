import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ profile }) => {
  const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <div className="profile-header-container">
      {/* Cover Photo */}
      <img
        src={getImageUrl(profile.coverPhoto, "https://placehold.co/800x220")}
        alt="Cover"
        className="profile-header-cover"
      />

      {/* Profile Picture */}
      <img
        src={getImageUrl(
          profile.profilePicture,
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        )}
        alt="Profile"
        className="profile-header-picture"
      />
    </div>
  );
};

export default ProfileHeader;
