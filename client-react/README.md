# Frontend README - Task Management UI

This frontend is the React.js implementation for the Full Stack Developer .

##  Scope Coverage

1. User Login and Signup: Implemented.
2. Dashboard displaying all tasks: Implemented.
3. Create task: Implemented.
4. Edit task: Implemented.
5. Delete task: Implemented.
6. Mark task Completed or Pending: Implemented.
7. Filter tasks by Completed, Pending, and All: Implemented.
8. Responsive UI for desktop and mobile: Implemented.

## Technical Expectations Coverage

1. Functional components and hooks: Implemented.
2. Reusable folder structure and components: Implemented.
3. State management with hooks and session module: Implemented.
4. Form validation on auth and task forms: Implemented.
5. Backend API integration: Implemented.
6. Clean modular code: Implemented.

## Tech Stack

1. React 19
2. Vite
3. React Router
4. Framer Motion
5. Tailwind CSS utilities

## Run Locally

```bash
cd client-react
npm install
```

Create [client-react/.env](.env):

```env
VITE_API_URL=http://localhost:5000
```

Run app:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

## Frontend Feature Details

1. Auth pages support signup and login with validation.
2. Session manager auto-refreshes access tokens.
3. Dashboard supports task create, edit, delete, and status changes.
4. Filters include all, pending, and completed views.
5. Search and pagination are integrated with backend endpoints.
6. Responsive layout supports mobile and desktop.

## API Integration Summary

1. POST /api/auth/signup
2. POST /api/auth/login
3. POST /api/auth/refresh
4. POST /api/auth/logout
5. GET /api/auth/me
6. GET /api/tasks
7. POST /api/tasks
8. PUT /api/tasks/:id
9. PATCH /api/tasks/:id/status
10. DELETE /api/tasks/:id
11. GET /api/tasks/summary

## Folder Structure

```text
client-react/
|-- src/
|   |-- components/
|   |-- hooks/
|   |-- services/
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- package.json
`-- README.md
```

## Assumptions

1. Backend is reachable through VITE_API_URL.
2. Backend CORS includes the frontend origin.
3. Browser allows secure cookies for deployed HTTPS environments.
4. User authentication is required for task endpoints.

## Live URLs

1. Frontend: https://adit-demo-2026.vercel.app
2. Backend: https://adit-demo-2026.onrender.com
3. Swagger: https://adit-demo-2026.onrender.com/api-docs

## Maintainer

Rupesh KLR

