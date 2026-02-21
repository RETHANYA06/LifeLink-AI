import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env.local") });
dotenv.config(); // Fallback to .env

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration - Use environment variables for security
const BUCKET_NAME = process.env.VITE_AWS_S3_BUCKET || "your-bucket-name";
const REGION = process.env.VITE_AWS_REGION || "us-east-1";

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadFile(filePath, s3Key) {
    const fileStream = fs.createReadStream(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileStream,
            ContentType: contentType,
        },
    });

    try {
        await upload.done();
        console.log(`✅ Uploaded: ${s3Key}`);
    } catch (err) {
        console.error(`❌ Failed to upload ${s3Key}:`, err);
    }
}

async function walkDirectory(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            await walkDirectory(filePath, callback);
        } else {
            await callback(filePath);
        }
    }
}

async function deploy() {
    const distPath = path.resolve(__dirname, "../dist");

    if (!fs.existsSync(distPath)) {
        console.error("❌ 'dist' folder not found. Did you run 'npm run build'?");
        process.exit(1);
    }

    if (!process.env.VITE_AWS_ACCESS_KEY_ID || !process.env.VITE_AWS_SECRET_ACCESS_KEY) {
        console.error("❌ AWS credentials not found in environment.");
        process.exit(1);
    }

    console.log(`🚀 Starting deployment to S3 bucket: ${BUCKET_NAME}...`);

    await walkDirectory(distPath, async (filePath) => {
        const relativePath = path.relative(distPath, filePath);
        const s3Key = relativePath.replace(/\\/g, "/"); // Ensure POSIX paths for S3
        await uploadFile(filePath, s3Key);
    });

    console.log("\n✨ Deployment Complete!");
}

deploy();
