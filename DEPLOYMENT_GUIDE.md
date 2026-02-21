# Frontend Deployment Guide (S3 + CloudFront)

## 1. Prerequisites
- AWS CLI installed and configured (`aws configure`).
- Production build generated (`npm run build`).

## 2. Infrastructure Setup
### S3 Bucket
- **Name**: `lifelink-frontend-prod`
- **Static Hosting**: Enabled (Index: `index.html`, Error: `index.html`)
- **Block Public Access**: Off (temporarily for direct S3 testing)

### CloudFront (Optional but Recommended)
- **Origin**: S3 Website Endpoint.
- **SSL**: Automatic via ACM (if using custom domain).
- **Caching**: Enabled for assets.

## 3. CloudFront Configuration
To enable HTTPS and global CDN:
1. Create a **CloudFront Distribution**.
2. **Origin Domain**: Select your S3 bucket website endpoint (e.g., `lifelink-frontend.s3-website-us-east-1.amazonaws.com`).
3. **Viewer Protocol Policy**: Redirect HTTP to HTTPS.
4. **Error Responses** (Crucial for React):
   - Create a Custom Error Response.
   - HTTP Error Code: `403` and `404`.
   - Customize Error Response: `Yes`.
   - Response Page Path: `/index.html`.
   - HTTP Response Code: `200`.

## 4. Deployment Command
Run this from the `lifelink/client` directory to sync your build to S3:

```bash
# Upload to S3
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete

# Invalidate CloudFront Cache (Optional)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 4. Automation script
You can add this to your `package.json` for one-click deploys:
```json
"deploy": "npm run build && aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete"
```
