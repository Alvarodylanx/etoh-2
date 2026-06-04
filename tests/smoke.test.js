/**
 * ETOH MARKET — SMOKE TEST SUITE
 * ================================
 * Quick pass/fail check on every major API endpoint.
 * Verifies the system is running and routes are reachable.
 */

const { cleanTestDb } = require('./setup');

let request, app, db;

beforeAll((done) => {
  cleanTestDb();
  // Reset module registry so DB_PATH env var is picked up
  jest.resetModules();
  db      = require('../database');
  app     = require('../app');
  request = require('supertest');
  // Give SQLite time to create tables
  setTimeout(done, 800);
});

afterAll((done) => {
  db.close(() => { cleanTestDb(); done(); });
});

// ─── Helper ────────────────────────────────────────────────────────────────
const api = () => {
  const s = request(app);
  return {
    get:    (url, token) => { const r = s.get(url);    if (token) r.set('Authorization','Bearer '+token); return r; },
    post:   (url, body, token) => { const r = s.post(url).send(body); if (token) r.set('Authorization','Bearer '+token); return r; },
    delete: (url, token) => { const r = s.delete(url); if (token) r.set('Authorization','Bearer '+token); return r; },
  };
};

describe('🟢 SMOKE TESTS — Public Endpoints', () => {
  test('ST-01  GET /api/stands        → 200 empty array',  async () => {
    const res = await request(app).get('/api/stands');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('ST-02  GET /api/products      → 200 empty array',  async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('ST-03  GET /api/posts         → 200 empty array',  async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('ST-04  GET /api/stands/9999   → 404 not found',   async () => {
    const res = await request(app).get('/api/stands/9999');
    expect(res.status).toBe(404);
  });

  test('ST-05  GET /api/products/9999 → 404 not found',   async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
  });
});

describe('🟢 SMOKE TESTS — Auth Endpoints', () => {
  test('ST-06  POST /api/auth/register (valid)  → 201',  async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ name:'Smoke Tester', email:'smoke@test.cm', password:'pass1234' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('smoke@test.cm');
  });

  test('ST-07  POST /api/auth/login (valid)     → 200',  async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email:'smoke@test.cm', password:'pass1234' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('ST-08  GET  /api/auth/me (with token)   → 200',  async () => {
    const login = await request(app).post('/api/auth/login')
      .send({ email:'smoke@test.cm', password:'pass1234' });
    const res = await request(app).get('/api/auth/me')
      .set('Authorization', 'Bearer ' + login.body.token);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('smoke@test.cm');
  });

  test('ST-09  GET  /api/auth/me (no token)     → 401',  async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('🟢 SMOKE TESTS — Protected Endpoints (no token)', () => {
  test('ST-10  POST /api/stands   (no token) → 401', async () => {
    const res = await request(app).post('/api/stands').send({ vendor_name:'X', phone_number:'123' });
    expect(res.status).toBe(401);
  });

  test('ST-11  POST /api/products (no token) → 401', async () => {
    const res = await request(app).post('/api/products').send({ stand_id:1, product_name:'X', price_cfa:100 });
    expect(res.status).toBe(401);
  });

  test('ST-12  POST /api/posts    (no token) → 401', async () => {
    const res = await request(app).post('/api/posts').send({ title:'X' });
    expect(res.status).toBe(401);
  });
});

describe('🟢 SMOKE TESTS — Admin Endpoints', () => {
  test('ST-13  GET /api/admin/stats (correct key) → 200', async () => {
    const res = await request(app).get('/api/admin/stats')
      .set('x-admin-key', 'test_admin_pass');
    expect(res.status).toBe(200);
    expect(res.body.products).toBeDefined();
  });

  test('ST-14  GET /api/admin/stats (wrong key)   → 401', async () => {
    const res = await request(app).get('/api/admin/stats')
      .set('x-admin-key', 'wrong_key');
    expect(res.status).toBe(401);
  });

  test('ST-15  GET /api/admin/stats (no key)      → 401', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });
});

describe('🟢 SMOKE TESTS — Orders Endpoint', () => {
  test('ST-16  POST /api/orders (no product) → 400 or 500', async () => {
    const res = await request(app).post('/api/orders').send({
      product_id: 9999, buyer_name: 'Test', target_city: 'Douala',
      target_quarter: 'Akwa', near_landmark: 'Near Total'
    });
    expect([400, 500]).toContain(res.status);
  });
});
