const request = require('supertest');
const { app, connectDatabase, User, Task } = require('../server');

let testUser;
let accessToken;

beforeAll(async () => {
  await connectDatabase();
  const email = `task-user-${Date.now()}@example.com`;
  const password = 'password123';
  // create user directly
  const user = await User.create({ name: 'Task User', email, passwordHash: await require('bcryptjs').hash(password, 10) });
  testUser = user;
  const loginRes = await request(app).post('/api/auth/login').send({ email, password });
  accessToken = loginRes.body.accessToken;
});

afterAll(async () => {
  await Task.deleteMany({ createdBy: testUser._id });
  await User.deleteOne({ _id: testUser._id });
  await require('mongoose').disconnect();
});

describe('Tasks CRUD', () => {
  let taskId;

  test('create task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Test Task', description: 'Task desc' });

    expect(res.statusCode).toBe(201);
    expect(res.body.task).toHaveProperty('id');
    taskId = res.body.task.id;
  });

  test('get tasks list', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('update task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Task', status: 'completed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.title).toBe('Updated Task');
    expect(res.body.task.status).toBe('completed');
  });

  test('delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });
});
