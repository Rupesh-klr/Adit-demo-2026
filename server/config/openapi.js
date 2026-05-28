function buildOpenApiSpec({ localPort, publicBaseUrl }) {
  const servers = [{ url: `http://localhost:${localPort}`, description: 'Local' }];

  if (publicBaseUrl) {
    servers.push({ url: publicBaseUrl, description: 'Production' });
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'Authentication and task management API',
    },
    servers,
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Tasks', description: 'Task management endpoints' },
      { name: 'System', description: 'System endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin', 'guest'] },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            createdBy: { oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/User' }] },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Server health info',
            },
          },
        },
      },
      '/api/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Sign up user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Signed up successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Logged in successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/guest-login': {
        post: {
          tags: ['Auth'],
          summary: 'Login as guest',
          responses: {
            200: {
              description: 'Guest login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh JWT access token',
          responses: {
            200: {
              description: 'Token refreshed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          responses: {
            200: { description: 'Logged out' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Current user' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/tasks/summary': {
        get: {
          tags: ['Tasks'],
          summary: 'Task summary counts',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Task counts' },
          },
        },
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'pending', 'completed'] } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1 } },
            { name: 'sortBy', in: 'query', schema: { type: 'string' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          ],
          responses: {
            200: { description: 'Task list with pagination' },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'completed'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Task created' },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task details' },
            404: { description: 'Task not found' },
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update task by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'completed'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Task updated' },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task deleted' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/api/tasks/{id}/status': {
        patch: {
          tags: ['Tasks'],
          summary: 'Change task status',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['pending', 'completed'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Task status updated' },
          },
        },
      },
    },
  };
}

module.exports = { buildOpenApiSpec };
