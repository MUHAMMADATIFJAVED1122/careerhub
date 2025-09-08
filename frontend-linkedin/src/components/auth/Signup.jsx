// src/components/auth/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Box, Button, Heading } from "@primer/react";
import { Link } from "react-router-dom";

import "./auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* CareerHub Heading */}
      <div className="login-logo-container">
        <h1 className="careerhub-title">CareerHub</h1>
      </div>

      {/* Card Box */}
      <Box
        sx={{
          bg: "#161a23",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          width: "364px",
          maxWidth: "90%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Heading as="h1" sx={{ fontSize: 4 }}>
          Sign Up
        </Heading>

        <div>
          <label className="label">Username</label>
          <input
            autoComplete="off"
            name="Username"
            id="Username"
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Email address</label>
          <input
            autoComplete="off"
            name="Email"
            id="Email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            autoComplete="off"
            name="Password"
            id="Password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          className="login-btn"
          disabled={loading}
          onClick={handleSignup}
        >
          {loading ? "Loading..." : "Signup"}
        </Button>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </Box>
    </div>
  );
};

export default Signup;
