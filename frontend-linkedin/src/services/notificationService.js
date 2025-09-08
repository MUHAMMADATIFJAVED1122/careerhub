// src/services/notificationService.js
import axios from "axios";
const BASE = "http://localhost:5000/api/notifications";

export const getNotifications = async (token) => {
  const { data } = await axios.get(BASE, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data; // array
};

export const markRead = async (token, id) => {
  const { data } = await axios.put(`${BASE}/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const markAllRead = async (token) => {
  const { data } = await axios.put(`${BASE}/read/all`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
