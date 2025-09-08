import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads/profile";
    if (file.fieldname === "coverPhoto") {
      folder = "uploads/covers";
    }
    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
    };
  },
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default profileUpload;
