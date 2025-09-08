import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const jobStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/jobs",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx"],
    resource_type: "auto", // auto-detect file type
  },
});

const jobUpload = multer({ storage: jobStorage });

export default jobUpload;
