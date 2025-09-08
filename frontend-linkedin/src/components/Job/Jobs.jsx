// src/components/jobs/Jobs.jsx
import React, { useEffect, useState } from "react";
import { fetchJobs } from "../../services/jobService";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Building } from "lucide-react"; // icons
import "bootstrap/dist/css/bootstrap.min.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(setJobs);
  }, []);

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-4 text-center">
        <Briefcase className="me-2" size={28} /> Latest Jobs
      </h1>

      <div className="row g-4">
        {jobs.map((job) => (
          <div className="col-md-6" key={job._id}>
            <div className="card h-100 shadow-sm border-0 rounded-3">
              <div className="card-body">
                {/* Job Title */}
                <h5 className="card-title fw-bold text-primary mb-2">
                  {job.title}
                </h5>

                {/* Company + Location */}
                <p className="text-muted mb-2">
                  <Building className="me-1" size={16} />
                  {job.company}
                  <span className="mx-2">•</span>
                  <MapPin className="me-1" size={16} />
                  {job.location}
                </p>

                {/* Description */}
                <p className="card-text text-secondary">
                  {job.description.slice(0, 100)}...
                </p>

                {/* Apply Button */}
                <Link
                  to={`/jobs/${job._id}`}
                  className="btn btn-outline-primary btn-sm mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <p className="text-center text-muted">No jobs available right now.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
