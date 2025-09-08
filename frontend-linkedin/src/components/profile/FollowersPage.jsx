import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFollowers, getFollowing } from "../../services/connectionService";
import "./Followers.css";

const FollowersPage = ({ type }) => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "followers") {
          const data = await getFollowers(userId);
          setUsers(Array.isArray(data) ? data : []);
        } else {
          const data = await getFollowing(userId);
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, userId]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="followers-page">
      <h2>{type === "followers" ? "Followers" : "Following"}</h2>
      {users.length > 0 ? (
        <ul className="followers-list">
          {users.map((user) => (
            <li key={user._id}>
              <Link to={`/profile/${user._id}`}>{user.username}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
      <Link to={`/profile/${userId}`} className="back-link">
        ← Back to Profile
      </Link>
    </div>
  );
};

export default FollowersPage;
