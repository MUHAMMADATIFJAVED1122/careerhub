// src/services/connectionService.js
import axios from "axios";
const BASE = "http://localhost:5000/api/connections";

export const followUser = async (token, targetId) => {
  const { data } = await axios.post(`${BASE}/${targetId}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const unfollowUser = async (token, targetId) => {
  const { data } = await axios.post(`${BASE}/${targetId}/unfollow`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const getFollowers = async (userId) => {
  const { data } = await axios.get(`${BASE}/${userId}/followers`);
  return data; // array of users
};

export const getFollowing = async (userId) => {
  const { data } = await axios.get(`${BASE}/${userId}/following`);
  return data; // array of users
};
