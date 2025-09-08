import React from "react";
import { Link } from "react-router-dom";
import "./Followers.css";

const FollowersList = ({ title, users, onClose }) => {
  return (
    <div className="followers-modal-overlay">
      <div className="followers-modal">
        <h3>{title}</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id}>
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FollowersList;
