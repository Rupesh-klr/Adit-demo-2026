# Backend README - Task Management API

This backend is the Node.js + Express.js service for the Full Stack Developer .

##  Scope Coverage

1. User authentication using JWT: Implemented.
2. REST API development: Implemented.
3. CRUD APIs for tasks: Implemented.
4. Protected routes: Implemented.
5. Proper error handling: Implemented.

## Tech Stack

1. Node.js
2. Express.js
3. MongoDB and Mongoose
4. JWT with access and refresh tokens
5. Cookie Parser and CORS
6. Socket.io
7. Swagger UI and OpenAPI
8. Jest and Supertest

## Environment Variables

Create [server/.env](.env):

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

## Run Locally

```bash
cd server
npm install
npm run dev
```

## API Details

### Auth APIs

1. POST /api/auth/signup
2. POST /api/auth/login
3. POST /api/auth/guest-login
4. POST /api/auth/refresh
5. POST /api/auth/logout
6. GET /api/auth/me

### Task APIs

1. GET /api/tasks
2. POST /api/tasks
3. GET /api/tasks/:id
4. PUT /api/tasks/:id
5. PATCH /api/tasks/:id/status
6. DELETE /api/tasks/:id
7. GET /api/tasks/summary

### System APIs

1. GET /api/health
2. GET /api-docs

## Security and Auth Notes

1. Protected endpoints require Bearer token.
2. Refresh token supports session continuation.
3. Cookies are configured for production HTTPS use.
4. CORS is origin-restricted through ALLOWED_ORIGIN.

## Bonus Features Implemented

1. Role-based access controls.
2. Pagination and search in task listing.
3. Swagger documentation for API exploration.
4. Automated tests for auth and tasks.

## Testing

```bash
cd server
npm test
```

## Swagger and Postman

1. Local docs: http://localhost:5000/api-docs
2. Render docs: https://adit-demo-2026.onrender.com/api-docs
3. Import OpenAPI spec into Postman from one of the above URLs.

## Folder Structure

```text
server/
|-- config/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- tests/
|-- utils/
|-- server.js
|-- package.json
`-- README.md
```

## Assumptions

1. MongoDB is reachable from the server environment.
2. DB_TYPE equals 1 for Mongo-backed execution.
3. Frontend origin matches ALLOWED_ORIGIN configuration.
4. Stateless refresh token strategy is acceptable for  scope.

## Maintainer

Rupesh KLR
