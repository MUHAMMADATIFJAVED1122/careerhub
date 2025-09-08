import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation, useParams } from "react-router-dom";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Posts from "./components/posts/Posts";
import Profile from "./components/profile/Profile";
import FollowersPage from "./components/profile/FollowersPage";
import Chat from "./components/chat/Chat";
import CallPage from "./components/chat/CallPage";

// Jobs
import Jobs from "./components/Job/Jobs";
import JobDetail from "./components/Job/JobDetail";
import PostJob from "./components/Job/PostJob";
import JobLayout from "./components/layout/JobLayout"; 
import EditJob from "./components/Job/EditJob"; 
// Auth Context
import { useAuth } from "./authContext";

const CallPageWrapper = () => {
  const { receiverId } = useParams();
  const location = useLocation();
  const callType = new URLSearchParams(location.search).get("type");
  const receiverName = location.state?.receiverName;
  const senderId = localStorage.getItem("userId");

  return (
    <CallPage
      callType={callType}
      receiverId={receiverId}
      senderId={senderId}
      receiverName={receiverName}
    />
  );
};

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    { path: "/profile/:userId", element: <Profile /> },
    { path: "/profile/:userId/followers", element: <FollowersPage type="followers" /> },
    { path: "/profile/:userId/following", element: <FollowersPage type="following" /> },
    { path: "/posts", element: <Posts /> },
    { path: "/chat", element: <Chat /> },
    { path: "/chat/:userId", element: <Chat /> },
    { path: "/call/:receiverId", element: <CallPageWrapper /> },

    // ✅ Jobs wrapped with JobLayout
    {
      path: "/jobs",
      element: (
        <JobLayout>
          <Jobs />
        </JobLayout>
      ),
    },
    {
      path: "/jobs/:id",
      element: (
        <JobLayout>
          <JobDetail />
        </JobLayout>
      ),
    },
    {
      path: "/post-job",
      element: (
        <JobLayout>
          <PostJob />
        </JobLayout>
      ),
    },
    {
  path: "/edit-job/:id",
  element: (
    <JobLayout>
      <EditJob />
    </JobLayout>
  ),
},
  
  ]);

  return element;
};

export default ProjectRoutes;
