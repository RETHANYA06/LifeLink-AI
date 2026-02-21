# AWS Integration Implementation Plan for LifeLink-AI

This plan outlines how to integrate AWS services into the LifeLink-AI project using the AWS Free Tier.

## 1. AWS S3 (Simple Storage Service) - [FREE TIER]
**Purpose**: Store and serve media files such as user profile pictures, medical reports, and equipment images.

### Implementation Steps:
1.  **S3 Bucket Creation**: Create a bucket (e.g., `linklifeai`). [COMPLETED]
2.  **AWS SDK Integration**: Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`. [COMPLETED]
3.  **Storage Service**: Create an `uploadService.ts` (implemented as `s3Service.ts`) to handle file uploads to S3. [COMPLETED]
4.  **Refactor**: Update `User`, `EquipmentRequest`, and `BloodRequest` models to store S3 URLs or keys. [COMPLETED]

---

## 2. AWS CloudFront (Content Delivery Network) - [FREE TIER]
**Purpose**: Speed up the delivery of media files from S3 and provide HTTPS access.

### Implementation Steps:
1.  **Distribution**: Create a CloudFront distribution with S3 as the origin. [COMPLETED]
2.  **Origin Access Control (OAC)**: Configure OAC so that S3 only allows access from CloudFront. [COMPLETED]
3.  **URL Refactor**: Update `s3Service.ts` to return CloudFront URLs instead of direct S3 URLs. [COMPLETED]
4.  **Cache Policy**: Set up CachingOptimized policy for performance. [COMPLETED]

---

## 3. AWS Cognito (Identity & Access Management) - [FREE TIER]
**Purpose**: Manage user authentication, authorization, and secure sign-in.

### Implementation Steps:
1.  **User Pool**: Set up a Cognito User Pool with email as the primary login. [COMPLETED]
2.  **App Client**: Configure an app client for the LifeLink-AI server. [COMPLETED]
3.  **Auth Integration**: Install `amazon-cognito-identity-js` or use `@aws-sdk/client-cognito-identity-provider`. [COMPLETED]
4.  **Migration**: Replace current `bcrypt` and `jwt` logic in `authController.ts` with Cognito API calls. [COMPLETED]
5.  **Middleware**: Update `authMiddleware.ts` to verify Cognito JWT tokens. [COMPLETED]

---

## 3. AWS Lambda (Serverless Compute) - [FREE TIER]
**Purpose**: Offload background tasks and event-driven logic to serverless functions. 

### Implementation Steps:
1.  **Functions**:
    - `notifyDonorsLambda`: Triggered when a new Blood Request is created. [IN PROGRESS]
    - `generateReportLambda`: Triggered when a request is completed to generate a PDF report. [PLANNED]
2.  **Framework**: Use Serverless Framework or AWS SAM to deploy functions. [PLANNED]
3.  **Triggers**: Connect Lambda functions to SNS (Simple Notification Service) or direct API calls. [PLANNED]

---

## 4. AWS DynamoDB (NoSQL Database) - [FREE TIER]
**Purpose**: High-speed, scalable storage for real-time tracking and audit logs.

### Implementation Steps:
1.  **Tables**: Create tables for `EmergencyLogs` and `UserActivity`.
2.  **Client**: Install `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`.
3.  **Integration**: Use DynamoDB for storing ephemeral data like real-time ambulance locations or system logs to complement MongoDB.

---

## 5. AWS API Gateway - [FREE TIER]
**Purpose**: Managed entry point for the Lambda functions.

### Implementation Steps:
1.  **REST API**: Create an API Gateway to expose the `notifyDonorsLambda`.
2.  **Endpoints**: Define endpoints like `POST /trigger-emergency`.
3.  **CORS**: Configure CORS to allow requests from the LifeLink-AI frontend.

---

## Cost Summary (Free Tier)
- **S3**: 5GB standard storage, 20k GET requests, 2k PUT requests.
- **CloudFront**: 1TB of data transfer out per month (Free Tier).
- **Lambda**: 1 million free requests per month.
- **Cognito**: 50,000 monthly active users (MAUs).
- **DynamoDB**: 25GB of storage, 25 provisioned Write and Read Capacity Units.
- **API Gateway**: 1 million HTTP/REST API calls received per month.

## Next Steps
1. ✅ S3 Integration is complete. Media can now be uploaded via `/api/media/upload`.
2. ✅ Models (`User`, `EquipmentRequest`, `BloodRequest`) updated to store S3 keys/URLs.
3. ✅ **AWS CloudFront** configured for faster media delivery (HTTPS).
4. ✅ **AWS Cognito Integration** completed. Authentication is now handled by AWS.
5. Begin **AWS Lambda** setup for background tasks (PDF generation, notifications).
