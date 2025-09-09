import axios from "axios";

const API_URL = "https://careerhubbackend-qnhl.onrender.com/api/jobs";

// Fetch all jobs
export const fetchJobs = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Get single job
export const getJobById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// Create Job
export const createJob = async (token, jobData) => {
  const formData = new FormData();
  for (const key in jobData) {
    if (jobData[key]) formData.append(key, jobData[key]);
  }

  const { data } = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ✅ Fixed Update Job
export const updateJob = async (token, id, jobData) => {
  const formData = new FormData();

  Object.keys(jobData).forEach((key) => {
    if (key === "jobImage") {
      if (jobData[key] instanceof File) {
        formData.append("jobImage", jobData[key]);
      }
      // skip if just URL string
    } else {
      if (jobData[key] !== undefined && jobData[key] !== null) {
        formData.append(key, jobData[key]);
      }
    }
  });

  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Delete job
export const deleteJob = async (token, id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Like a job
export const likeJob = async (token, id) => {
  const { data } = await axios.put(
    `${API_URL}/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// Comment on a job
export const commentJob = async (token, id, text) => {
  const { data } = await axios.post(
    `${API_URL}/${id}/comment`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// Delete a comment
export const deleteComment = async (token, jobId, commentId) => {
  const { data } = await axios.delete(
    `${API_URL}/${jobId}/comment/${commentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
