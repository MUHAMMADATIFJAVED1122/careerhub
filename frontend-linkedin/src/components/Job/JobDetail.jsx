import React, { useEffect, useState } from "react";
import {
  getJobById,
  deleteJob,
  likeJob,
  commentJob,
  deleteComment,
} from "../../services/jobService";
import { useParams, useNavigate } from "react-router-dom";

// ✅ MUI Imports
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import WorkIcon from "@mui/icons-material/Work";

const getImageUrl = (url, fallback = "/default-avatar.png") =>
  url || fallback;

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch {
      setError("❌ Failed to load job details.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job?")) return;
    try {
      setLoading(true);
      await deleteJob(token, id);
      navigate("/jobs", { replace: true });
    } catch {
      setError("❌ Failed to delete job.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (likeLoading) return;
    try {
      setLikeLoading(true);
      const res = await likeJob(token, id);
      setJob((prev) => ({
        ...prev,
        likes: res.likesCount,
        likedByUser: !prev?.likedByUser,
      }));
    } catch {
      setError("❌ Failed to like/unlike job.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await commentJob(token, id, newComment);
      setJob((prev) => ({
        ...prev,
        comments: [...(prev?.comments || []), res.comment],
      }));
      setNewComment("");
    } catch {
      setError("❌ Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(token, id, commentId);
      setJob((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch {
      setError("❌ Failed to delete comment.");
    }
  };

  if (error)
    return (
      <Box className="p-4 text-red-500 bg-red-100 rounded">{error}</Box>
    );
  if (!job)
    return (
      <Box className="p-4 text-center">
        <CircularProgress />
      </Box>
    );

  return (
    <Card
      sx={{
        maxWidth: 700,
        mx: "auto",
        my: 3,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <CardHeader
        avatar={
          <Avatar src={getImageUrl(job.createdBy?.profilePicture)}>
            {job.createdBy?.username?.[0]}
          </Avatar>
        }
        title={job.createdBy?.username}
        subheader={job.company}
      />

      {job.jobImage && (
        <Box component="img"
          src={job.jobImage}
          alt="job"
          sx={{ width: "100%", borderRadius: 2, mb: 2 }}
        />
      )}

      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {job.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={job.likedByUser ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {job.likes || 0}
        </Button>

        {job.applyLink && (
          <Button
            href={job.applyLink}
            target="_blank"
            variant="contained"
            color="primary"
          >
            Apply Now
          </Button>
        )}
      </CardActions>

      <Divider />

      {/* Comments */}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>

        {job.comments?.length > 0 ? (
          job.comments.map((c) => (
            <Box
              key={c._id}
              display="flex"
              alignItems="flex-start"
              mb={2}
              gap={2}
            >
              <Avatar src={getImageUrl(c.user?.profilePicture)}>
                {c.user?.username?.[0]}
              </Avatar>
              <Box flex={1}>
                <Typography variant="subtitle2">{c.user?.username}</Typography>
                <Typography variant="body2">{c.text}</Typography>
                {c.user?._id === userId && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleAddComment}
          display="flex"
          gap={1}
          mt={2}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <IconButton type="submit" color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>

      {/* Job Owner Actions */}
      {job.createdBy?._id === userId && (
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-job/${job._id}`)}
          >
            Edit
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default JobDetail;
