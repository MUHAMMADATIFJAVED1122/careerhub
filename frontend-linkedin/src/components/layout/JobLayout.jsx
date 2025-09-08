import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusSquare } from "lucide-react";
import "./JobLayout.css"; // <-- import the CSS file

const JobLayout = ({ children }) => {
  return (
    <div className="job-layout-root">
      <header className="job-layout-header">
        <div className="job-container">
          {/* Brand */}
          <h2 className="job-brand">
            <Link to="/jobs" className="job-brand-link" aria-label="Job Portal Home">
              <Briefcase className="job-brand-icon" />
              <span className="job-brand-text">Job Portal</span>
            </Link>
          </h2>

          {/* Nav */}
          <nav className="job-nav" aria-label="Jobs navigation">
            <Link to="/jobs" className="job-nav-link">
              <Briefcase className="job-nav-icon" />
              <span>Browse Jobs</span>
            </Link>

            <Link to="/post-job" className="job-nav-link job-nav-link-post">
              <PlusSquare className="job-nav-icon" />
              <span>Post a Job</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="job-main">{children}</main>
    </div>
  );
};

export default JobLayout;
