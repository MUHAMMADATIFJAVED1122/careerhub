import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useParams, useNavigate } from "react-router-dom";
import { normalizeId } from "../../utils/normalizeId";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../../services/connectionService";

import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileEditForm from "./ProfileEditForm";
import ProfilePosts from "./ProfilePosts";
import "./Profile.css"; // ✅ Import the CSS

const Profile = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [safeUserId, setSafeUserId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [iFollowThisUser, setIFollowThisUser] = useState(false);

  const token = localStorage.getItem("token");

  // safeUserId
  useEffect(() => {
    if (currentUser) {
      const id = typeof currentUser === "string" ? currentUser : currentUser._id;
      setSafeUserId(normalizeId(id));
    } else {
      const storedId = localStorage.getItem("userId");
      if (storedId) setSafeUserId(normalizeId(storedId));
    }
  }, [currentUser]);

  const viewedUserId = normalizeId(userId) || safeUserId;
  const isOwnProfile = safeUserId === viewedUserId;

  // Profile fetch
  useEffect(() => {
    if (!viewedUserId) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          isOwnProfile
            ? "https://careerhubbackend-qnhl.onrender.com/api/profile"
            : `https://careerhubbackend-qnhl.onrender.com/api/profile/${viewedUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = isOwnProfile ? res.data.user : res.data;
        setProfile(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          jobTitle: data.jobTitle || "",
          company: data.company || "",
          skills: data.skills?.join(", ") || "",
          profilePicture: data.profilePicture || "",
          coverPhoto: data.coverPhoto || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [viewedUserId, isOwnProfile, token]);

  // Connections
  useEffect(() => {
    const loadConnections = async () => {
      if (!viewedUserId || !safeUserId) return;
      try {
        const [f1, f2] = await Promise.all([
          getFollowers(viewedUserId),
          getFollowing(viewedUserId),
        ]);
        setFollowers(Array.isArray(f1) ? f1 : []);
        setFollowing(Array.isArray(f2) ? f2 : []);

        if (!isOwnProfile) {
          const myFollowing = await getFollowing(safeUserId);
          setIFollowThisUser(
            myFollowing.some((u) => normalizeId(u._id) === viewedUserId)
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadConnections();
  }, [viewedUserId, safeUserId, isOwnProfile]);

  // Posts
  useEffect(() => {
    if (!viewedUserId) return;
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          isOwnProfile
            ? "https://careerhubbackend-qnhl.onrender.com/api/posts/my-posts"
            : `https://careerhubbackend-qnhl.onrender.com/api/posts/user/${viewedUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [viewedUserId, isOwnProfile, token]);

  if (!profile || !safeUserId) return <p>Loading profile...</p>;

  const toggleFollowProfile = async () => {
    if (!token) return alert("Login to follow users");
    try {
      if (iFollowThisUser) {
        await unfollowUser(token, viewedUserId);
        setIFollowThisUser(false);
        setFollowers((prev) =>
          prev.filter((u) => normalizeId(u._id) !== safeUserId)
        );
      } else {
        await followUser(token, viewedUserId);
        setIFollowThisUser(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <ProfileHeader profile={profile} />
        <ProfileInfo
          profile={profile}
          followers={followers}
          following={following}
          isOwnProfile={isOwnProfile}
          iFollowThisUser={iFollowThisUser}
          toggleFollowProfile={toggleFollowProfile}
          setEditing={setEditing}
        />

        {!isOwnProfile && (
          <div className="profile-actions">
            <button
              onClick={() => navigate(`/chat/${viewedUserId}`)}
              className="btn btn-primary"
            >
              💬 Chat with {profile.username}
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="profile-card edit-form">
          <ProfileEditForm
            form={form}
            setForm={setForm}
            token={token}
            setProfile={setProfile}
            setEditing={setEditing}
          />
        </div>
      )}

      <div className="profile-card">
        <ProfilePosts
          posts={posts}
          setPosts={setPosts}
          isOwnProfile={isOwnProfile}
          profile={profile}
          safeUserId={safeUserId}
          token={token}
        />
      </div>
    </div>
  );
};

export default Profile;
