import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },
      { quality: "auto" },
    ],
  } as any,
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("only image allowed"));
    }
  },
});
