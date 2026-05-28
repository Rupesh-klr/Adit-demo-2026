const request = require('supertest');
const { app, connectDatabase, User } = require('../server');

let serverStarted = false;

beforeAll(async () => {
  // Use a memory MongoDB or a test DB; here we assume MONGO_URL_TALEEO_LMS points to a test DB
  await connectDatabase();
});

afterAll(async () => {
  // clean up users created during tests
  await User.deleteMany({ email: /test-user/ });
  // close mongoose connection
  await require('mongoose').disconnect();
});

describe('Auth endpoints', () => {
  const testEmail = `test-user-${Date.now()}@example.com`;
  const password = 'password123';

  test('signup -> login -> me', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: testEmail, password });

    expect(signupRes.statusCode).toBe(201);
    expect(signupRes.body).toHaveProperty('accessToken');

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('accessToken');

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.user.email).toBe(testEmail);
  }, 20000);
});
