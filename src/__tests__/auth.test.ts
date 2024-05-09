import { app, supertest } from '../config/test-setup';
import { generateExpiredToken } from '../services/auth.service';

describe('Register', () => {
  test('POST /auth/register', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send({
        personalInfo: {
          firstName: 'test003',
          lastName: 'test',
          studentId: '003',
          faculty: 'Engineering',
          department: 'Computer Science',
          year: 3,
          email: 'test@example.com',
          image:
            'https://img.freepik.com/free-photo/happy-young-female-student-holding-notebooks-from-courses-smiling-camera-standing-spring-clothes-against-blue-background_1258-70161.jpg'
        },
        password: 'password123'
      });
    expect(response.status).toBe(201);
  }, 60000);

  test('POST /auth/register - User already exists', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send({
        personalInfo: {
          firstName: 'test003',
          lastName: 'test',
          studentId: '003',
          faculty: 'Engineering',
          department: 'Computer Science',
          year: 3,
          email: 'test@example.com',
          image:
            'https://img.freepik.com/free-photo/happy-young-female-student-holding-notebooks-from-courses-smiling-camera-standing-spring-clothes-against-blue-background_1258-70161.jpg'
        },
        password: 'password123'
      });
    expect(response.status).toBe(502);
  });
});

describe('Login', () => {
  test('POST /auth/login', async () => {
    const loginResponse = await supertest(app).post('/auth/login').send({
      studentId: '003',
      password: 'password123'
    });
    expect(loginResponse.status).toBe(200);
  }, 60000);
});

describe('Get logged in user', () => {
  let token: string;
  test('POST /auth/user', async () => {
    const loginResponse = await supertest(app).post('/auth/login').send({
      studentId: '003',
      password: 'password123'
    });
    token = loginResponse.body.token;
    const response = await supertest(app)
      .post('/auth/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, 60000);

  test('POST /auth/user - Unauthorized', async () => {
    const response = await supertest(app).post('/auth/user');
    expect(response.status).toBe(401);
  });

  test('POST /auth/user - Invalid token', async () => {
    const response = await supertest(app)
      .post('/auth/user')
      .set('Authorization', `Bearer invalidtoken`);
    expect(response.status).toBe(401);
  });

  test('POST /auth/user - Token expired', async () => {
    const expiredToken = generateExpiredToken(token);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await supertest(app)
      .post('/auth/user')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(response.status).toBe(401);
  });
});
