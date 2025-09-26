// 5. إنشاء ملف e2e/homepage.test.js
const request = require('supertest');
const app = require('../server');

// اختبارات نهاية إلى نهاية (E2E)
describe('Homepage E2E Tests', () => {
  it('should return 200 and render the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('مرحباً بكم في جمعية نماء الخيرية');
  });

  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.statusCode).toEqual(404);
  });
});

// اختبارات واجهة برمجة التطبيقات (API)
describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return API status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/donors (Protected)', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/donors');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 with valid token', async () => {
      // تسجيل الدخول أولاً للحصول على رمز
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });
      
      const token = loginRes.body.token;
      
      // استخدام الرمز للوصول إلى الموارد المحمية
      const res = await request(app)
        .get('/api/donors')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
