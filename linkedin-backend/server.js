// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import http from "http";
// import connectDB from "./config/db.js";
// import { initSocket } from "./utils/socket.js";

// // Routers
// import userRouter from "./routes/user.routes.js";
// import postRouter from "./routes/post.routes.js";
// import profileRoutes from "./routes/profile.routes.js";
// import connectionRoutes from "./routes/connection.Routes.js";
// import notificationRouter from "./routes/notification.Routes.js";
// import chatRouter from "./routes/chat.routes.js";

// dotenv.config();
// const app = express();

// // middleware
// app.use(express.json());
// app.use(cors());
// app.use(morgan("dev"));

// // routes
// app.use("/api/users", userRouter);
// app.use("/api/posts", postRouter);
// app.use("/api/profile", profileRoutes);
// app.use("/api/connections", connectionRoutes);
// app.use("/api/notifications", notificationRouter);
// app.use("/api/chat", chatRouter);

// // connect db
// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   const server = http.createServer(app);

//   // initialize socket
//   initSocket(server);

//   server.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });








import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js";

// Routers
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import chatRouter from "./routes/chat.routes.js";
import callRouter from "./routes/call.routes.js";
import jobRouter from "./routes/job.routes.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// root route (health check)
app.get("/", (req, res) => {
  res.send("CareerHub Backend API is running 🚀");
});

// routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/calls", callRouter);
app.use("/api/jobs", jobRouter);

// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = http.createServer(app);

  // initialize socket (chat + video call signaling)
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
