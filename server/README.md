# Task Management API Server

Node.js + Express.js backend for a task management app with MongoDB, JWT authentication, protected task CRUD routes, refresh tokens, Socket.io events, and Swagger documentation.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + refresh tokens
- Socket.io
- Swagger UI

## Environment Variables
Create a `.env` file in this folder with:

```env
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173,https://yourdomain.com
DB_TYPE=1
ENABLE_GUEST_LOGIN=true
JWT_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

## Setup
```bash
cd server
npm install
npm run dev
```

## API Routes
- `POST /api/auth/signup` - register a user
- `POST /api/auth/login` - login with email and password
- `POST /api/auth/guest-login` - optional guest access when enabled
- `POST /api/auth/refresh` - rotate access token using the refresh token
- `POST /api/auth/logout` - clear auth cookies
- `GET /api/auth/me` - current authenticated user
- `GET /api/tasks` - list tasks with `status`, `search`, `page`, and `limit`
- `POST /api/tasks` - create a task
- `GET /api/tasks/:id` - get a single task
- `PUT /api/tasks/:id` - update a task
- `PATCH /api/tasks/:id/status` - mark task pending/completed
- `DELETE /api/tasks/:id` - delete a task
- `GET /api/tasks/summary` - dashboard counts
- `GET /api/health` - health check
- `GET /api-docs` - Swagger UI

## Additional Features
- Role-based access: users have roles `user`, `admin`, or `guest`. Certain operations (e.g., deleting another user's task) are restricted to `admin`.
- Pagination & Search: `GET /api/tasks` supports `page`, `limit`, `search`, `status` (pending/completed/all), `sortBy`, and `order`.

## Unit Tests
We provide basic unit tests using Jest and Supertest located in the `tests/` folder. They exercise signup/login and task CRUD operations.

Run tests:
```bash
cd server
npm install
npm test
```

## Swagger / Postman
- The API is documented with Swagger at `/api-docs` when the server is running.
- To create a Postman collection, import the OpenAPI spec from `http://localhost:5000/api-docs`.

## Folder Structure
- `server.js` - main Express app and route definitions
- `tests/` - Jest + Supertest test suites
- `package.json` - scripts and dependencies
- `_env_sample` - sample environment variables

## Assumptions
- MongoDB is used when `DB_TYPE=1` and connection string is provided in `MONGO_URL_TALEEO_LMS`.
- Tasks are private to the creating user unless an `admin` performs cross-user operations.
- Refresh tokens are JWTs stored in httpOnly cookies by default; token revocation is not implemented (stateless refresh tokens).

## Notes
- Tasks are stored per authenticated user.
- Filtering supports `All`, `Pending`, and `Completed` through the `status` query parameter.
- Socket events are emitted for task create, update, and delete actions.
