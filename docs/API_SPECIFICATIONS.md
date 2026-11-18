# VeriCourse AI — REST API Specifications
**Base URL:** `http://localhost:8000/api`  
**Interactive Documentation:** Swagger UI at `http://localhost:8000/docs`, ReDoc at `http://localhost:8000/redoc`

---

## 1. Authentication Endpoints (`/auth`)

### 1.1 User Registration
- **Route:** `POST /api/auth/register`
- **Description:** Creates a new student or evaluator account.
- **Request Body:**
  ```json
  {
    "full_name": "Aarav Sharma",
    "email": "aarav@example.com",
    "password": "SecurePassword@123",
    "role": "student"
  }
  ```
- **Responses:**
  - `201 Created`: User successfully registered with user details (excluding password hash).
  - `400 Bad Request`: Email already registered.

### 1.2 User Login
- **Route:** `POST /api/auth/login`
- **Description:** Authenticates user and issues JWT bearer token.
- **Request Body:**
  ```json
  {
    "email": "aarav@example.com",
    "password": "SecurePassword@123"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "token_type": "bearer",
      "user": {
        "id": 1,
        "full_name": "Aarav Sharma",
        "email": "aarav@example.com",
        "role": "student"
      }
    }
    ```
  - `401 Unauthorized`: Invalid email or password.

---

## 2. Course Endpoints (`/courses`)

### 2.1 Discover Verified Courses
- **Route:** `GET /api/courses/discover`
- **Description:** Retrieves paginated list of publicly verified courses with computed trust scores.
- **Query Parameters:**
  - `search` (optional, string): Filter by title, provider, or keyword.
  - `category` (optional, string): Filter by subject domain.
  - `min_score` (optional, integer): Filter by minimum trust rating.
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "title": "Python for Data Science",
      "provider": "NPTEL",
      "course_url": "https://nptel.ac.in/courses/...",
      "fee": 1000.0,
      "trust_score": 88,
      "status": "verified"
    }
  ]
  ```

### 2.2 Submit Course for Verification
- **Route:** `POST /api/courses/submit`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Submits a new course syllabus or URL to trigger the multi-agent verification pipeline.
- **Request Body:**
  ```json
  {
    "title": "Full Stack AI Bootcamp",
    "provider": "TechBootcamp Academy",
    "course_url": "https://techbootcamp.example/ai",
    "fee": 45000.0,
    "description": "Guaranteed 100% placement with Microsoft and Google."
  }
  ```
- **Response `201 Created`:** Course registered, analysis job queued.

---

## 3. Verification Report Endpoints (`/reports`)

### 3.1 Get Course Verification Report
- **Route:** `GET /api/reports/course/{course_id}`
- **Description:** Retrieves full multi-agent verification breakdown including claim assessments and risk scores.
- **Response `200 OK`:**
  ```json
  {
    "report_id": 10,
    "course_id": 1,
    "overall_trust_score": 88,
    "accreditation_status": "verified",
    "placement_risk": "low",
    "curriculum_depth_score": 92,
    "faculty_credibility_score": 95,
    "summary": "High credibility curriculum verified through Indian Ministry of Education affiliation.",
    "claims": [
      {
        "id": 1,
        "statement": "Certificate granted by IIT Madras",
        "verified": true,
        "confidence": 0.96,
        "evidence": "NPTEL National Coordinator listing for IIT Madras."
      }
    ]
  }
  ```

---

## 4. Student Experiences Endpoints (`/experiences`)

### 4.1 List Course Experiences
- **Route:** `GET /api/experiences/course/{course_id}`
- **Description:** Fetches verified student feedback, rating, and employment outcome reports.

### 4.2 Submit Experience
- **Route:** `POST /api/experiences`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "course_id": 1,
    "rating": 5,
    "review_text": "Excellent coursework, difficult exams, credible certificate.",
    "placement_achieved": true
  }
  ```

---

## 5. System Health Check (`/health`)
- **Route:** `GET /api/health`
- **Description:** Microservice operational health probe.
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "project": "VeriCourse AI"
  }
  ```
