import { Router } from "express";
import multer from "multer";
import { uploadMedia, deleteMedia } from "../controllers/mediaController";

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Route to upload media
router.post("/upload", upload.single("file"), uploadMedia);

// Route to delete media
router.delete("/delete", deleteMedia);

export default router;
