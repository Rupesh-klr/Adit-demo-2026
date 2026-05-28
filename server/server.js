/**
 * Task Management API Server
 *
 * Features:
 *  - User authentication using JWT (access + refresh tokens)
 *  - REST API development with Express
 *  - CRUD APIs for tasks (create, read, update, delete)
 *  - Protected routes (middleware verifies JWT)
 *  - Proper error handling and JSON responses
 *  - Real-time events via Socket.io for task create/update/delete
 *
 * Database:
 *  - MongoDB (configure connection via `MONGO_URL_TALEEO_LMS` in .env)
 *
 * Environment variables (see _env_sample):
 *  - PORT, ALLOWED_ORIGIN, DB_TYPE, ENABLE_GUEST_LOGIN
 *  - JWT_SECRET, REFRESH_TOKEN_SECRET
 *  - MONGO_URL_TALEEO_LMS
 *
 * Routes (high-level):
 *  - POST /api/auth/signup
 *  - POST /api/auth/login
 *  - POST /api/auth/guest-login
 *  - POST /api/auth/refresh
 *  - POST /api/auth/logout
 *  - GET  /api/auth/me
 *  - GET  /api/tasks
 *  - POST /api/tasks
 *  - GET  /api/tasks/:id
 *  - PUT  /api/tasks/:id
 *  - PATCH/POST /api/tasks/:id/status
 *  - DELETE /api/tasks/:id
 *  - GET  /api/tasks/summary
 *
 * Notes:
 *  - Tasks are scoped per authenticated user.
 *  - Use the `status` query parameter to filter by `pending`, `completed`, or `all`.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const DB_TYPE = String(process.env.DB_TYPE || '1');
const USE_MONGO = DB_TYPE === '1';
const MONGO_URI = process.env.MONGO_URL_TALEEO_LMS || process.env.MONGO_URL || '';
const JWT_SECRET = process.env.JWT_SECRET || 'development-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'development-refresh-secret';
const ENABLE_GUEST_LOGIN = String(process.env.ENABLE_GUEST_LOGIN || 'false').toLowerCase() === 'true';
const isProduction = process.env.NODE_ENV === 'production';

const swaggerDocs = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'Authentication and task management API',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

app.use(helmet());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

io.on('connection', socket => {
  socket.emit('connected', { message: 'Socket connected' });
});

// expose io to controllers via app
app.set('io', io);

// Models, config and routes (modularized)
const User = require('./models/User');
const Task = require('./models/Task');
const { connectDatabase: connectDB } = require('./config/db');
const { authenticate: authenticateFactory, authorize } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');

// mount routes
const authenticate = authenticateFactory(JWT_SECRET);
app.use('/api/auth', authRoutes({ JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions, ENABLE_GUEST_LOGIN }, authenticate));
app.use('/api/tasks', tasksRoutes(authenticate));

// use the connectDB helper internally
const connectDatabase = async () => {
  if (!USE_MONGO) throw new Error('DB_TYPE is not set to MongoDB mode. Set DB_TYPE=1 to enable the Mongo backend.');
  if (!MONGO_URI) throw new Error('MONGO_URL_TALEEO_LMS is missing from the environment.');
  await connectDB(MONGO_URI);
};

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


const normalizeStatus = value => {
  if (!value) return null;
  const normalized = String(value).toLowerCase();
  if (normalized === 'pending' || normalized === 'completed') return normalized;
  return null;
};

const parsePage = value => Math.max(1, Number.parseInt(value, 10) || 1);
const parseLimit = value => Math.min(100, Math.max(1, Number.parseInt(value, 10) || 10));

app.get('/api/health', asyncHandler(async (req, res) => {
  const stateName = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    db: stateName,
    mode: USE_MONGO ? 'mongo' : 'disabled',
    guestLoginEnabled: ENABLE_GUEST_LOGIN,
  });
}));



app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API is running',
    docs: '/api-docs',
    health: '/api/health',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong on the server.',
  });
});

const start = async () => {
  await connectDatabase();
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve();
    });
  });
};

// Export app and start for testing and external runners
module.exports = { app, server, start, connectDatabase, User, Task, authorize };

// If run directly, start the server
if (require.main === module) {
  start().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
