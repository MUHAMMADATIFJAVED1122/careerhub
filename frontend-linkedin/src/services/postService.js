import axios from "axios";

const API_URL = "https://careerhubbackend-qnhl.onrender.com/api/posts";

// ✅ Create Post with image
export const createPost = async (token, postData) => {
  const formData = new FormData();
  formData.append("content", postData.content);
  if (postData.image) formData.append("image", postData.image);

  const res = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Get All Posts
export const getAllPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Update Post with image replace
export const updatePost = async (token, postId, postData) => {
  const formData = new FormData();
  formData.append("content", postData.content);
  if (postData.image) formData.append("image", postData.image);

  const res = await axios.put(`${API_URL}/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Delete Post
export const deletePost = async (token, postId) => {
  const res = await axios.delete(`${API_URL}/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Like Post
export const likePost = async (token, postId) => {
  const res = await axios.post(`${API_URL}/like/${postId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Comment on Post
export const commentPost = async (token, postId, text) => {
  const res = await axios.post(`${API_URL}/comment/${postId}`, { text }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.comment;
};
