# Full Stack Developer  - Task Management Web App

This repository contains the completed  for a Task Management Web Application using React.js on the frontend and Node.js + Express.js on the backend.

##  Context

1. Required Stack: React.js + Node.js + Express.js
2. Goal: Build a secure, responsive task manager with authentication and CRUD task workflows.

## Project Overview

The solution is organized into two deployable applications.

1. [client-react](client-react): React frontend with animated and responsive UI.
2. [server](server): Express API with JWT auth, MongoDB persistence, protected task routes, and Swagger docs.

## Tech Stack Used

### Frontend

1. React 19
2. Vite
3. React Router
4. Framer Motion
5. Tailwind CSS utilities

### Backend

1. Node.js
2. Express.js
3. MongoDB with Mongoose
4. JWT access and refresh token authentication
5. Cookie Parser + CORS
6. Socket.io
7. Swagger UI and OpenAPI spec
8. Jest and Supertest

## Feature Coverage Against 

### Frontend Features

1. User Login and Signup: Implemented.
2. Dashboard displaying all tasks: Implemented.
3. Create new task: Implemented.
4. Edit task: Implemented.
5. Delete task: Implemented.
6. Mark Completed or Pending: Implemented.
7. Filter by All, Pending, Completed: Implemented.
8. Responsive desktop and mobile UI: Implemented.

### Frontend Technical Expectations

1. Functional components and hooks: Implemented.
2. Structured reusable components: Implemented.
3. State management with hooks and modular service layer: Implemented.
4. Form validation for auth and task inputs: Implemented.
5. API integration with backend endpoints: Implemented.
6. Clean maintainable structure: Implemented.

### Backend Features

1. JWT-based authentication: Implemented.
2. REST APIs: Implemented.
3. Task CRUD APIs: Implemented.
4. Protected routes: Implemented.
5. Error handling: Implemented.

### Database

1. MongoDB selected and implemented via Mongoose.

### Bonus Coverage

1. Role-based access: Implemented.
2. Pagination and search: Implemented.
3. Unit and integration tests: Implemented.
4. Deployment: Implemented on Vercel and Render.
5. Swagger API documentation: Implemented.

## Local Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/Rupesh-klr/Adit-demo-2026.git
cd Adit-demo-2026
```

### 2. Setup backend

```bash
cd server
npm install
```

Create [server/.env](server/.env) with:

```env
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173,https://adit-demo-2026.vercel.app
PUBLIC_BASE_URL=https://adit-demo-2026.onrender.com
DB_TYPE=1
ENABLE_GUEST_LOGIN=true
JWT_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Run backend:

```bash
npm run dev
```

### 3. Setup frontend

Open another terminal:

```bash
cd client-react
npm install
```

Create [client-react/.env](client-react/.env) with:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

### 4. Local access URLs

1. Frontend: http://localhost:5173
2. Backend: http://localhost:5000
3. Swagger: http://localhost:5000/api-docs

## API Details

### Auth Endpoints

1. POST /api/auth/signup
2. POST /api/auth/login
3. POST /api/auth/guest-login
4. POST /api/auth/refresh
5. POST /api/auth/logout
6. GET /api/auth/me

### Task Endpoints

1. GET /api/tasks
2. POST /api/tasks
3. GET /api/tasks/:id
4. PUT /api/tasks/:id
5. PATCH /api/tasks/:id/status
6. DELETE /api/tasks/:id
7. GET /api/tasks/summary

### System Endpoints

1. GET /api/health
2. GET /api-docs

## Folder Structure

```text
Adit-demo-2026/
|-- client-react/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- services/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   `-- package.json
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- tests/
|   |-- utils/
|   |-- server.js
|   `-- package.json
`-- README.md
```

## Assumptions Made

1. MongoDB connection is available and valid.
2. Backend runs in Mongo mode when DB_TYPE equals 1.
3. Frontend origin must match configured ALLOWED_ORIGIN entries.
4. Access token is short-lived and refresh token maintains session continuity.
5. Task ownership is user-scoped, with elevated admin behavior where applicable.
6. Production is served over HTTPS for secure cookie behavior.

## Submission Requirements Mapping

1. GitHub Repository Link: Included in clone instructions.
2. Deployment Link: Included below.
3. README contents required by : Covered in this file.

## Deployment Links

1. Frontend: https://adit-demo-2026.vercel.app
2. Backend: https://adit-demo-2026.onrender.com
3. API Docs: https://adit-demo-2026.onrender.com/api-docs

## Evaluation Checklist Alignment

1. Code quality and structure: Modular architecture in frontend and backend.
2. UI responsiveness and UX: Responsive, animated task interface.
3. API design and integration: RESTful API with documented endpoints.
4. Authentication implementation: JWT access plus refresh flow.
5. Database design: Mongoose models for users and tasks.
6. Error handling: Centralized API error responses and validation checks.
7. Performance optimization: Pagination, search, and scoped queries.
8. Best practices: Config-driven setup, protected routes, tests, docs.

## Important Notes

1. This project is prepared in  format and optimized for maintainability.
2. The architecture favors clear separation of concerns for scale and future enhancements.
3. Plagiarism was avoided by implementing project-specific structure and behavior.

## Additional Documentation

1. Backend documentation: [server/README.md](server/README.md)
2. Frontend documentation: [client-react/README.md](client-react/README.md)

Developed by Rupesh KLR
