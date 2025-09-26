// 4. إنشاء ملف test/auth.test.js
const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const { generateToken } = require('../utils/auth');

describe('Authentication API', () => {
  beforeAll(async () => {
    // تنظيف قاعدة البيانات قبل الاختبارات
    await db.query('TRUNCATE TABLE users');
    
    // إضافة مستخدم تجريبي
    await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['testuser', '$2b$10$examplehash', 'user']
    );
  });

  afterAll(async () => {
    // إغلاق اتصال قاعدة البيانات
    await db.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'Password123!',
          email: 'test@example.com'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'wrongpass'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});
