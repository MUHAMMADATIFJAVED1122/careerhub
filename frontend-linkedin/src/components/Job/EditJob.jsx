import React, { useEffect, useState } from "react";
import { getJobById, updateJob } from "../../services/jobService";
import { useParams, useNavigate } from "react-router-dom";
import "./job.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    applyLink: "",
    jobImage: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    getJobById(id)
      .then((data) => {
        if (!data) return navigate("/jobs", { replace: true });

        setForm({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          description: data.description || "",
          applyLink: data.applyLink || "",
          jobImage: data.jobImage || "",
        });
      })
      .catch(() => navigate("/jobs", { replace: true }));
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setNewFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob(token, id, {
        ...form,
        jobImage: newFile || form.jobImage,
      });
      navigate(`/jobs/${id}`);
    } catch {
      setError("❌ Failed to update job.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white text-center py-3 rounded-top-4">
          <h3 className="mb-0">✏️ Edit Job</h3>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold">Job Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                required
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                required
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Job Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write job details..."
                className="form-control"
                rows="4"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Application Link</label>
              <input
                type="url"
                name="applyLink"
                value={form.applyLink}
                onChange={handleChange}
                placeholder="https://example.com/apply"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Upload Job Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
              <div className="mt-3 d-flex gap-3">
                {!newFile && form.jobImage && (
                  <img
                    src={form.jobImage}
                    alt="current"
                    className="rounded border shadow-sm"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
                {newFile && (
                  <img
                    src={URL.createObjectURL(newFile)}
                    alt="preview"
                    className="rounded border shadow-sm"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
