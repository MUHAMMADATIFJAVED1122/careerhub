import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/posts",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
    resource_type: "auto", // support images/videos
  },
});

const postUpload = multer({
  storage: postStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default postUpload;
