import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.VITE_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.VITE_AWS_S3_BUCKET;

/**
 * Uploads a file to S3
 * @param file - Multer file object
 * @param folder - Destination folder in the bucket
 * @returns Object containing the file key and URL
 */
export const uploadToS3 = async (file: Express.Multer.File, folder: string = "media") => {
    if (!BUCKET_NAME) {
        throw new Error("S3 Bucket name is not configured in environment variables.");
    }

    const fileKey = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        await s3Client.send(command);
        return {
            key: fileKey,
            url: `https://${BUCKET_NAME}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`,
        };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload file to S3");
    }
};

/**
 * Generates a presigned URL for a file
 * @param key - S3 object key
 * @returns Presigned URL string
 */
export const getPresignedUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw new Error("Could not generate presigned URL");
    }
};

/**
 * Deletes a file from S3
 * @param key - S3 object key
 */
export const deleteFromS3 = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error("Error deleting from S3:", error);
        throw new Error("Failed to delete file from S3");
    }
};
