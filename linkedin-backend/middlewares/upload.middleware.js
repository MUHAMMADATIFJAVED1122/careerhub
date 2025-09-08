import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/general",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({
  storage: generalStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
