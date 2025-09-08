// src/components/jobs/PostJob.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  Avatar,
} from "@mui/material";
import {
  Business,
  LocationOn,
  Work,
  Link as LinkIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const PostJob = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    applyLink: "",
    jobImage: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setForm({ ...form, jobImage: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(token, form);
      navigate("/jobs");
    } catch {
      setError("❌ Failed to post job. Try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card sx={{ width: 600, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="h1"
            color="primary"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            <Work sx={{ mr: 1, verticalAlign: "middle" }} /> Post a Job
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                ),
              }}
            />

            {/* Company */}
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />

            {/* Location */}
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Job Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              margin="normal"
              multiline
              rows={4}
            />

            {/* Apply Link */}
            <TextField
              fullWidth
              label="Apply Link (optional)"
              name="applyLink"
              value={form.applyLink}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Upload Image */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
              startIcon={<ImageIcon />}
            >
              Upload Job Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {form.jobImage && (
              <Box textAlign="center" mb={2}>
                <Avatar
                  src={URL.createObjectURL(form.jobImage)}
                  alt="preview"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    margin: "auto",
                    boxShadow: 2,
                  }}
                />
              </Box>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostJob;
