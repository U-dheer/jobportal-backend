# Job Portal API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "JobSeeker",
  "name": "John Doe",
  "address": "123 Main St, City, Country",
  "telephone": "+1234567890"
}
```

**Role Options:**

- `JobSeeker` - For job seekers
- `Employer` - For employers/companies
- `Admin` - For administrators

**Response:**

```json
{
  "id": "user_id_here",
  "email": "user@example.com",
  "role": "JobSeeker",
  "name": "John Doe",
  "address": "123 Main St, City, Country",
  "telephone": "+1234567890",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 1.2 Login User

**POST** `/auth/login`

Login with email and password to get JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "role": "JobSeeker",
    "isActive": true
  }
}
```

---

## 2. User Management Endpoints

### 2.1 Get My Profile

**GET** `/users/me`

Get current user's profile information.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": "user_id_here",
  "email": "user@example.com",
  "role": "JobSeeker",
  "name": "John Doe",
  "address": "123 Main St, City, Country",
  "telephone": "+1234567890",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2.2 Update My Profile

**PATCH** `/users/me`

Update current user's profile information.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "password": "newpassword123",
  "name": "Jane Doe",
  "address": "456 New St, City, Country",
  "telephone": "+9876543210"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response:**

```json
{
  "id": "user_id_here",
  "email": "newemail@example.com",
  "role": "JobSeeker",
  "name": "Jane Doe",
  "address": "456 New St, City, Country",
  "telephone": "+9876543210",
  "isActive": true,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2.3 Upload Resume

**POST** `/users/me/upload-resume`

Upload a resume file (PDF or DOCX only).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```
Form Data:
- file: [PDF or DOCX file]
```

**Response:**

```json
{
  "message": "Resume uploaded successfully",
  "resumeUrl": "/uploads/resumes/user_id_here-1234567890.pdf"
}
```

---

## 3. Job Management Endpoints

### 3.1 Create Job

**POST** `/jobs`

Create a new job posting (Employer role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for a senior software engineer with 5+ years of experience in Node.js and React.",
  "salary": 80000,
  "location": "New York, NY"
}
```

**Note:** `employerId` is set automatically from the authenticated user and should NOT be included in the request body.

**Response:**

```json
{
  "id": "job_id_here",
  "title": "Senior Software Engineer",
  "description": "We are looking for a senior software engineer...",
  "salary": 80000,
  "location": "New York, NY",
  "employerId": {
    "id": "employer_user_id_here",
    "name": "Tech Company Inc",
    "email": "hr@techcompany.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3.2 Get All Jobs

**GET** `/jobs`

Get all available job postings (no authentication required).

**Query Parameters:**

- `title` (optional): Search jobs by title
- `location` (optional): Search jobs by location

**Response:**

```json
[
  {
    "id": "job_id_1",
    "title": "Senior Software Engineer",
    "description": "We are looking for...",
    "salary": 80000,
    "location": "New York, NY",
    "employerId": {
      "id": "employer_user_id_here",
      "name": "Tech Company Inc",
      "email": "hr@techcompany.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "job_id_2",
    "title": "Frontend Developer",
    "description": "Join our team...",
    "salary": 70000,
    "location": "San Francisco, CA",
    "employerId": {
      "id": "employer_user_id_2",
      "name": "Startup XYZ",
      "email": "careers@startupxyz.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3.3 Get Job by ID

**GET** `/jobs/:id`

Get a specific job by its ID (no authentication required).

**Response:**

```json
{
  "id": "job_id_here",
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "salary": 80000,
  "location": "New York, NY",
  "employerId": {
    "id": "employer_user_id_here",
    "name": "Tech Company Inc",
    "email": "hr@techcompany.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3.4 Get My Jobs (Employer Only)

**GET** `/jobs/my`

Get all jobs posted by the authenticated employer (Employer role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "job_id_1",
    "title": "Senior Software Engineer",
    "description": "We are looking for...",
    "salary": 80000,
    "location": "New York, NY",
    "employerId": {
      "id": "employer_user_id_here",
      "name": "Tech Company Inc",
      "email": "hr@techcompany.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "job_id_2",
    "title": "Frontend Developer",
    "description": "Join our team...",
    "salary": 70000,
    "location": "San Francisco, CA",
    "employerId": {
      "id": "employer_user_id_here",
      "name": "Tech Company Inc",
      "email": "hr@techcompany.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3.5 Update Job (Employer Only)

**PATCH** `/jobs/:jobId`

Update a job posting (Employer role required, can only update own jobs).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Senior Software Engineer",
  "description": "Updated job description...",
  "salary": 85000,
  "location": "New York, NY"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response:**

```json
{
  "id": "job_id_here",
  "title": "Updated Senior Software Engineer",
  "description": "Updated job description...",
  "salary": 85000,
  "location": "New York, NY",
  "employerId": {
    "id": "employer_user_id_here",
    "name": "Tech Company Inc",
    "email": "hr@techcompany.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3.6 Delete Job (Employer Only)

**DELETE** `/jobs/:jobId`

Delete a job posting (Employer role required, can only delete own jobs).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Job deleted successfully"
}
```

---

## 4. Application Management Endpoints

### 4.1 Apply for Job

**POST** `/applications/:jobId`

Apply for a job (JobSeeker role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Route Parameter:**

- `jobId`: The ID of the job to apply for.

**Request Body:**

```json
{
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am excited to apply for this position. I have 5 years of experience in software development and believe I would be a great fit for your team."
}
```

**Note:** `jobId` is taken from the route, and `jobSeekerId` is set automatically from the authenticated user. `status` is set to `Applied` by default.

**Response:**

```json
{
  "id": "application_id_here",
  "status": "Applied",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am excited to apply...",
  "jobId": "job_id_here",
  "jobSeekerId": "jobseeker_user_id_here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4.2 Get My Applications

**GET** `/applications/me`

Get all applications submitted by the current user (JobSeeker role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "application_id_1",
    "status": "Applied",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am excited to apply...",
    "jobId": {
      "id": "job_id_1",
      "title": "Senior Software Engineer",
      "description": "We are looking for...",
      "salary": 80000,
      "location": "New York, NY",
      "employerId": "employer_user_id_here"
    },
    "jobSeekerId": "jobseeker_user_id_here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "application_id_2",
    "status": "Viewed",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I would love to join...",
    "jobId": {
      "id": "job_id_2",
      "title": "Frontend Developer",
      "description": "Join our team...",
      "salary": 70000,
      "location": "San Francisco, CA",
      "employerId": "employer_user_id_2"
    },
    "jobSeekerId": "jobseeker_user_id_here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4.3 Get My Applied Jobs (JobSeeker Only)

**GET** `/applications/my-jobs`

Get all jobs the current user has applied to with populated job details (JobSeeker role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "application_id_1",
    "status": "Applied",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am excited to apply...",
    "jobId": {
      "id": "job_id_1",
      "title": "Senior Software Engineer",
      "description": "We are looking for...",
      "salary": 80000,
      "location": "New York, NY",
      "employerId": "employer_user_id_here"
    },
    "jobSeekerId": "jobseeker_user_id_here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "application_id_2",
    "status": "Viewed",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I would love to join...",
    "jobId": {
      "id": "job_id_2",
      "title": "Frontend Developer",
      "description": "Join our team...",
      "salary": 70000,
      "location": "San Francisco, CA",
      "employerId": "employer_user_id_2"
    },
    "jobSeekerId": "jobseeker_user_id_here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4.4 Get Applications for Job

**GET** `/applications/job/:jobId`

Get all applications for a specific job (Employer role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "application_id_1",
    "status": "Applied",
    "resumeUrl": "https://example.com/resume1.pdf",
    "coverLetter": "I am excited to apply...",
    "jobId": "job_id_here",
    "jobSeekerId": {
      "id": "jobseeker_user_id_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "application_id_2",
    "status": "Viewed",
    "resumeUrl": "https://example.com/resume2.pdf",
    "coverLetter": "I would love to join...",
    "jobId": "job_id_here",
    "jobSeekerId": {
      "id": "jobseeker_user_id_2",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 5. Messaging Endpoints

### 5.1 Send Message

**POST** `/messages/:receiverId`

Send a message to another user (JobSeeker or Employer role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `receiverId` (path parameter): The ID of the user to send the message to

**Body:**

```json
{
  "content": "Hello! I'm interested in your job posting. Would you like to schedule an interview?"
}
```

**Note:** `senderId` is set automatically from the authenticated user. `timestamp` is set automatically.

**Response:**

```json
{
  "id": "message_id_here",
  "senderId": "sender_user_id_here",
  "receiverId": "receiver_user_id_here",
  "content": "Hello! I'm interested in your job posting...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5.2 Get Inbox

**GET** `/messages/inbox`

Get all messages in the current user's inbox.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "message_id_1",
    "senderId": "sender_user_id_1",
    "receiverId": "current_user_id",
    "content": "Hello! I'm interested in your job posting...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "message_id_2",
    "senderId": "sender_user_id_2",
    "receiverId": "current_user_id",
    "content": "Thank you for your application...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

### 5.3 Get Conversation with a User

**GET** `/messages/conversation/:userId`

Get all messages between the current user and a specific user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Route Parameter:**

- `userId`: The ID of the user to get the conversation with.

**Response:**

```json
[
  {
    "id": "message_id_1",
    "senderId": "sender_user_id_1",
    "receiverId": "current_user_id",
    "content": "Hello! I'm interested in your job posting...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "message_id_2",
    "senderId": "sender_user_id_2",
    "receiverId": "current_user_id",
    "content": "Thank you for your application...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 6. Admin Endpoints

### 6.1 Suspend User

**PATCH** `/admin/suspend/:userId`

Suspend a user account (Admin role required). This sets `isActive` to `false`.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "User suspended successfully",
  "userId": "user_id_here",
  "isActive": false
}
```

### 6.2 Activate (Resume) User

**PATCH** `/admin/activate/:userId`

Reactivate a suspended user account (Admin role required). This sets `isActive` to `true`.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "User activated successfully",
  "userId": "user_id_here",
  "isActive": true
}
```

### 6.3 Delete User

**DELETE** `/admin/delete/:userId`

Delete a user account permanently (Admin role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "User deleted successfully",
  "userId": "user_id_here"
}
```

### 6.4 Get Usage Report

**GET** `/admin/report`

Get system usage report (Admin role required).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "totalUsers": 150,
  "totalJobs": 45,
  "totalApplications": 230,
  "totalMessages": 89,
  "activeUsers": 120,
  "systemStats": {
    "uptime": "24h 30m",
    "memoryUsage": "256MB",
    "cpuUsage": "15%"
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Job not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Testing Workflow

1. **Start the server:**

   ```bash
   npm run start:dev
   ```

2. **Register a user:**

   ```bash
   POST http://localhost:3000/auth/register
   ```

3. **Login to get JWT token:**

   ```bash
   POST http://localhost:3000/auth/login
   ```

4. **Use the token for authenticated requests:**
   ```bash
   GET http://localhost:3000/users/me
   Authorization: Bearer <your_jwt_token>
   ```

---

## Swagger Documentation

Access the interactive API documentation at:

```
http://localhost:3000/api
```

This provides a web interface to test all endpoints directly from your browser.

## ✅ **Updated API Usage:**

### **Send a Message**

**URL:** `POST http://localhost:3000/messages/6888ca2f93de6e74c25c5f82`

**Headers:**

```
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

**Body:**

```json
{
  "content": "Hello! I'm interested in your job posting. Would you like to schedule an interview?"
}
```

## 🔧 **What Changed:**

1. **Route updated**: Now uses `POST /messages/:receiverId`
2. **Receiver ID in URL**: The receiver ID (`6888ca2f93de6e74c25c5f82`) is now part of the URL path
3. **Simplified body**: Only need to send the `content` in the request body
4. **Automatic sender**: Your user ID is automatically set as the sender from the JWT token

## 📋 **Available Endpoints:**

1. **Send Message**: `POST /messages/:receiverId`
2. **Get Inbox**: `GET /messages/inbox`
3. **Get Conversation**: `GET /messages/conversation/:userId`

Now your original request should work perfectly! The URL `http://localhost:3000/messages/6888ca2f93de6e74c25c5f82` with the body `{"content": "Hello! I'm interested in your job posting. Would you like to schedule an interview?"}` will send a message to the user with ID `6888ca2f93de6e74c25c5f82`.

Just make sure to include your JWT token in the Authorization header!

Just make sure to include your JWT token in the Authorization header!
