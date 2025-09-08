import express from "express";
// import { signup, login } from "../controllers/userController.js";
import { signup,login } from "../controllers/user.controller.js";
// import authMiddleware from "../middlewares/auth.middleware.js";


const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);


// userRouter.get("/profile", authMiddleware, getProfile);


export default userRouter;
