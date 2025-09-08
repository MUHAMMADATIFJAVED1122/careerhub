import React, { useState } from "react";
import axios from "axios";
import "./ProfileEditForm.css"; // New CSS for styling

const ProfileEditForm = ({ form, setForm, token, setProfile, setEditing }) => {
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("bio", form.bio);
      formData.append("location", form.location);
      formData.append("jobTitle", form.jobTitle);
      formData.append("company", form.company);
      if (form.skills) {
        formData.append(
          "skills",
          form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        );
      }

      if (profileFile) formData.append("profilePicture", profileFile);
      else if (form.profilePicture) formData.append("profilePicture", form.profilePicture);

      if (coverFile) formData.append("coverPhoto", coverFile);
      else if (form.coverPhoto) formData.append("coverPhoto", form.coverPhoto);

      const res = await axios.put("http://localhost:5000/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  return (
    <div className="profile-edit-card">
      <h2>Edit Profile</h2>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Job Title</label>
        <input
          type="text"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Company</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Skills (comma separated)</label>
        <input
          type="text"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files[0])} />
        {form.profilePicture && !profileFile && (
          <img src={form.profilePicture} alt="Profile" className="preview-img" />
        )}
      </div>

      <div className="form-group">
        <label>Cover Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
        {form.coverPhoto && !coverFile && (
          <img src={form.coverPhoto} alt="Cover" className="preview-img" />
        )}
      </div>

      <div className="form-buttons">
        <button className="btn btn-primary" onClick={saveProfile}>Save</button>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
