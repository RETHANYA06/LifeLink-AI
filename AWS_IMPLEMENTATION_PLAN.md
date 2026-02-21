# AWS Integration Implementation Plan for LifeLink-AI

This plan outlines how to integrate AWS services into the LifeLink-AI project using the AWS Free Tier.

## 1. AWS S3 (Simple Storage Service) - [FREE TIER]
**Purpose**: Store and serve media files such as user profile pictures, medical reports, and equipment images.

### Implementation Steps:
1.  **S3 Bucket Creation**: Create a bucket (e.g., `linklifeai`). [COMPLETED]
2.  **AWS SDK Integration**: Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`. [COMPLETED]
3.  **Storage Service**: Create an `uploadService.ts` (implemented as `s3Service.ts`) to handle file uploads to S3. [COMPLETED]
4.  **Refactor**: Update `User` and `Equipment` models to store S3 URLs or keys instead of local paths. [IN PROGRESS]

---

## 2. AWS Cognito (Identity & Access Management) - [FREE TIER]
**Purpose**: Manage user authentication, authorization, and secure sign-in.

### Implementation Steps:
1.  **User Pool**: Set up a Cognito User Pool with email as the primary login.
2.  **App Client**: Configure an app client for the LifeLink-AI server.
3.  **Auth Integration**: Install `amazon-cognito-identity-js` or use `@aws-sdk/client-cognito-identity-provider`.
4.  **Migration**: Replace current `bcrypt` and `jwt` logic in `authController.ts` with Cognito API calls.
5.  **Middleware**: Update `authMiddleware.ts` to verify Cognito JWT tokens.

---

## 3. AWS Lambda (Serverless Compute) - [FREE TIER]
**Purpose**: Offload background tasks and event-driven logic to serverless functions. 

### Implementation Steps:
1.  **Functions**:
    - `notifyDonorsLambda`: Triggered when a new Blood Request is created.
    - `generateReportLambda`: Triggered when a request is completed to generate a PDF report.
2.  **Framework**: Use Serverless Framework or AWS SAM to deploy functions.
3.  **Triggers**: Connect Lambda functions to SNS (Simple Notification Service) or direct API calls.

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
- **Lambda**: 1 million free requests per month.
- **Cognito**: 50,000 monthly active users (MAUs).
- **DynamoDB**: 25GB of storage, 25 provisioned Write and Read Capacity Units.
- **API Gateway**: 1 million HTTP/REST API calls received per month.

## Next Steps
1. ✅ S3 Integration is complete. Media can now be uploaded via `/api/media/upload`.
2. Refactor `User` model to use S3 for avatars.
3. Begin **AWS Cognito Integration** to replace local JWT authentication.
