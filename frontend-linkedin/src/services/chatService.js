// src/services/chatService.js
import axios from "axios";

const API_URL = "https://careerhubbackend-qnhl.onrender.com/api/chat";

// Delete a message
export const deleteMessage = async (token, messageId) => {
  const res = await axios.delete(`${API_URL}/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
