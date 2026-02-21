import { Request, Response } from "express";
import { uploadToS3, deleteFromS3 } from "../services/s3Service";

export const uploadMedia = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const folder = req.body.folder || "media";
        const result = await uploadToS3(req.file, folder);

        res.status(200).json({
            message: "File uploaded successfully",
            ...result
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMedia = async (req: Request, res: Response) => {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ message: "File key is required" });
        }

        await deleteFromS3(key);

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
