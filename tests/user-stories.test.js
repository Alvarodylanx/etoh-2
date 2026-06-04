/**
 * ETOH MARKET — USER STORY ACCEPTANCE TESTS
 * ===========================================
 * Tests the complete lifecycle of each user story end-to-end.
 *
 * US-001  Vendor registers and creates a stand
 * US-002  Vendor adds a product with category and price
 * US-003  Buyer browses market and filters by region/category
 * US-004  Buyer views product details and reveals seller contact (safety gate)
 * US-005  Buyer places a delivery order with landmark address
 * US-006  Vendor manages their stand (edit info, delete product)
 * US-007  Vendor posts a Market Buzz reel
 * US-008  User updates their profile (bio + WhatsApp)
 * US-009  Admin logs in and views dashboard stats
 * US-010  Admin edits product details and uploads reel
 */

const { cleanTestDb } = require('./setup');
const path = require('path');
const fs   = require('fs');

let request, app, db;

// Shared state across tests
const ctx = {};

beforeAll((done) => {
  cleanTestDb();
  jest.resetModules();
  db      = require('../database');
  app     = require('../app');
  request = require('supertest');
  setTimeout(done, 800);
});

afterAll((done) => {
  db.close(() => { cleanTestDb(); done(); });
});

// ─── Helpers ───────────────────────────────────────────────────────────────
async function register(name, email, pw = 'password123') {
  const r = await request(app).post('/api/auth/register').send({ name, email, password: pw });
  return r.body;
}
async function login(email, pw = 'password123') {
  const r = await request(app).post('/api/auth/login').send({ email, password: pw });
  return r.body;
}
function auth(token) { return { Authorization: 'Bearer ' + token }; }
function adminH()    { return { 'x-admin-key': 'test_admin_pass' }; }

// ══════════════════════════════════════════════════════════════════════════
//  US-001  Vendor registers and creates a stand
// ══════════════════════════════════════════════════════════════════════════
describe('US-001 — Vendor Registration & Stand Creation', () => {
  test('US-001-A  Vendor registers with name, email, password → 201 + JWT token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Josephine Mbarga', email: 'josephine@test.cm', password: 'market2024'
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('Josephine Mbarga');
    ctx.josephineToken = res.body.token;
    ctx.josephineUser  = res.body.user;
  });

  test('US-001-B  Authenticated vendor creates a stand with name, phone, city → 201', async () => {
    const res = await request(app).post('/api/stands')
      .set(auth(ctx.josephineToken))
      .send({ vendor_name: 'Josephine Fashion Hub', phone_number: '677001111', stand_description: 'African fashion wear', city: 'Douala' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.vendor_name).toBe('Josephine Fashion Hub');
    ctx.standId = res.body.id;
  });

  test('US-001-C  Stand appears in public market listing', async () => {
    const res = await request(app).get('/api/stands');
    expect(res.status).toBe(200);
    const found = res.body.find((s) => s.id === ctx.standId);
    expect(found).toBeDefined();
    expect(found.vendor_name).toBe('Josephine Fashion Hub');
  });

  test('US-001-D  Vendor can view their own stands list', async () => {
    const res = await request(app).get('/api/stands/mine').set(auth(ctx.josephineToken));
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].vendor_name).toBe('Josephine Fashion Hub');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-002  Vendor adds a product with category and price
// ══════════════════════════════════════════════════════════════════════════
describe('US-002 — Product Listing', () => {
  test('US-002-A  Vendor adds product with name, price, category → 201', async () => {
    const res = await request(app).post('/api/products')
      .set(auth(ctx.josephineToken))
      .field('stand_id', String(ctx.standId))
      .field('product_name', 'Kaba Ngondo Traditional Dress')
      .field('price_cfa', '35000')
      .field('category', 'fashion');
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    ctx.productId = res.body.id;
  });

  test('US-002-B  Product appears in public product listing', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    const found = res.body.find((p) => p.id === ctx.productId);
    expect(found).toBeDefined();
    expect(found.price_cfa).toBe(35000);
    expect(found.category).toBe('fashion');
  });

  test('US-002-C  Vendor adds a second product (electronics)', async () => {
    const res = await request(app).post('/api/products')
      .set(auth(ctx.josephineToken))
      .field('stand_id', String(ctx.standId))
      .field('product_name', 'Ankara Fabric 6 yards')
      .field('price_cfa', '12000')
      .field('category', 'fashion');
    expect(res.status).toBe(201);
    ctx.product2Id = res.body.id;
  });

  test('US-002-D  Product detail endpoint returns vendor phone', async () => {
    const res = await request(app).get(`/api/products/${ctx.productId}`);
    expect(res.status).toBe(200);
    expect(res.body.product_name).toBe('Kaba Ngondo Traditional Dress');
    expect(res.body.phone_number).toBe('677001111');
    expect(res.body.vendor_name).toBe('Josephine Fashion Hub');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-003  Buyer browses market and filters by region / category
// ══════════════════════════════════════════════════════════════════════════
describe('US-003 — Market Browsing & Filtering', () => {
  beforeAll(async () => {
    // Seed a second vendor in Yaoundé for filter testing
    const r = await register('Chef Bello', 'bello@test.cm');
    ctx.belloToken = r.token;
    const s = await request(app).post('/api/stands')
      .set(auth(ctx.belloToken))
      .send({ vendor_name: "Bello's Kitchen", phone_number: '699002222', city: 'Yaoundé', stand_description: 'Cameroonian spices' });
    ctx.belloStandId = s.body.id;
    await request(app).post('/api/products')
      .set(auth(ctx.belloToken))
      .field('stand_id', String(ctx.belloStandId))
      .field('product_name', 'Fresh Ndolé Leaves')
      .field('price_cfa', '500')
      .field('category', 'food');
  });

  test('US-003-A  Browsing all products returns all listed items', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('US-003-B  Filter by city=Douala shows only Douala products', async () => {
    const res = await request(app).get('/api/products?city=Douala');
    expect(res.status).toBe(200);
    res.body.forEach((p) => expect(p.city).toBe('Douala'));
  });

  test('US-003-C  Filter by city=Yaoundé shows only Yaoundé products', async () => {
    const res = await request(app).get('/api/products?city=Yaoundé');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    res.body.forEach((p) => expect(p.city).toBe('Yaoundé'));
  });

  test('US-003-D  Filter by category=fashion shows only fashion products', async () => {
    const res = await request(app).get('/api/products?category=fashion');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    res.body.forEach((p) => expect(p.category).toBe('fashion'));
  });

  test('US-003-E  Filter city=Douala + category=food returns empty array', async () => {
    const res = await request(app).get('/api/products?city=Douala&category=food');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test('US-003-F  Stand listing returns all stands', async () => {
    const res = await request(app).get('/api/stands');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-004  Buyer views product + safety gate (contact reveal)
// ══════════════════════════════════════════════════════════════════════════
describe('US-004 — Product Detail & Safety Gate', () => {
  test('US-004-A  Buyer views product detail page without auth → 200', async () => {
    const res = await request(app).get(`/api/products/${ctx.productId}`);
    expect(res.status).toBe(200);
    expect(res.body.product_name).toBeDefined();
  });

  test('US-004-B  Product detail includes seller phone number', async () => {
    const res = await request(app).get(`/api/products/${ctx.productId}`);
    expect(res.body.phone_number).toBe('677001111');
  });

  test('US-004-C  Stand detail includes all products for that stand', async () => {
    const res = await request(app).get(`/api/stands/${ctx.standId}`);
    expect(res.status).toBe(200);
    expect(res.body.stand).toBeDefined();
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThanOrEqual(2);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-005  Buyer places delivery order with landmark address
// ══════════════════════════════════════════════════════════════════════════
describe('US-005 — Delivery Order Placement', () => {
  test('US-005-A  Buyer places order with all required fields → 200', async () => {
    const res = await request(app).post('/api/orders').send({
      product_id:    ctx.productId,
      buyer_name:    'Paul Mvondo',
      target_city:   'Douala',
      target_quarter:'Akwa',
      near_landmark: 'Opposite Total Energies Station Akwa'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/success/i);
    ctx.orderId = res.body.id;
  });

  test('US-005-B  Order is recorded (admin can view it)', async () => {
    const res = await request(app).get('/api/admin/orders').set(adminH());
    expect(res.status).toBe(200);
    const found = res.body.find((o) => o.id === ctx.orderId);
    expect(found).toBeDefined();
    expect(found.buyer_name).toBe('Paul Mvondo');
    expect(found.near_landmark).toBe('Opposite Total Energies Station Akwa');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-006  Vendor manages their stand (edit stand, delete product)
// ══════════════════════════════════════════════════════════════════════════
describe('US-006 — Stand & Product Management', () => {
  test('US-006-A  Vendor edits stand description → 200', async () => {
    const res = await request(app).put(`/api/stands/${ctx.standId}`)
      .set(auth(ctx.josephineToken))
      .send({ stand_description: 'Updated: Best African fashion in Douala-Akwa' });
    expect(res.status).toBe(200);
  });

  test('US-006-B  Edit is persisted on next fetch', async () => {
    const res = await request(app).get(`/api/stands/${ctx.standId}`);
    expect(res.body.stand.stand_description).toBe('Updated: Best African fashion in Douala-Akwa');
  });

  test('US-006-C  Vendor deletes one of their products → 200', async () => {
    const res = await request(app).delete(`/api/products/${ctx.product2Id}`)
      .set(auth(ctx.josephineToken));
    expect(res.status).toBe(200);
  });

  test('US-006-D  Deleted product no longer appears on stand', async () => {
    const res = await request(app).get(`/api/stands/${ctx.standId}`);
    const ids = res.body.products.map((p) => p.id);
    expect(ids).not.toContain(ctx.product2Id);
  });

  test('US-006-E  Vendor cannot delete another vendor\'s product → 403', async () => {
    const res = await request(app).delete(`/api/products/${ctx.productId}`)
      .set(auth(ctx.belloToken));
    expect(res.status).toBe(403);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-007  Vendor posts a Market Buzz reel
// ══════════════════════════════════════════════════════════════════════════
describe('US-007 — Market Buzz Post Creation', () => {
  test('US-007-A  Vendor creates a post (image type) → 201', async () => {
    const res = await request(app).post('/api/posts')
      .set(auth(ctx.josephineToken))
      .field('title', '🎉 New collection arrived!')
      .field('description', 'Check out our latest Ankara dresses')
      .field('stand_id', String(ctx.standId));
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    ctx.postId = res.body.id;
  });

  test('US-007-B  Post appears in public feed', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    const found = res.body.find((p) => p.id === ctx.postId);
    expect(found).toBeDefined();
    expect(found.title).toBe('🎉 New collection arrived!');
  });

  test('US-007-C  Anyone can like a post (no auth required)', async () => {
    const res = await request(app).post(`/api/posts/${ctx.postId}/like`);
    expect(res.status).toBe(200);
    expect(res.body.likes).toBeGreaterThanOrEqual(1);
  });

  test('US-007-D  Like increments counter', async () => {
    await request(app).post(`/api/posts/${ctx.postId}/like`);
    const res = await request(app).post(`/api/posts/${ctx.postId}/like`);
    expect(res.body.likes).toBeGreaterThanOrEqual(2);
  });

  test('US-007-E  Vendor deletes their own post → 200', async () => {
    const r2 = await request(app).post('/api/posts')
      .set(auth(ctx.josephineToken))
      .field('title', 'Temp post to delete')
      .field('description', '');
    const res = await request(app).delete(`/api/posts/${r2.body.id}`)
      .set(auth(ctx.josephineToken));
    expect(res.status).toBe(200);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-008  User updates profile (bio + WhatsApp number)
// ══════════════════════════════════════════════════════════════════════════
describe('US-008 — Profile Management', () => {
  test('US-008-A  User updates bio and WhatsApp → 200 with updated fields', async () => {
    const res = await request(app).put('/api/auth/profile')
      .set(auth(ctx.josephineToken))
      .field('bio', 'Fashion vendor in Douala since 2015')
      .field('whatsapp', '677001111');
    expect(res.status).toBe(200);
    expect(res.body.bio).toBe('Fashion vendor in Douala since 2015');
    expect(res.body.whatsapp).toBe('677001111');
  });

  test('US-008-B  /me endpoint returns updated profile fields', async () => {
    const res = await request(app).get('/api/auth/me').set(auth(ctx.josephineToken));
    expect(res.status).toBe(200);
    expect(res.body.whatsapp).toBe('677001111');
    expect(res.body.bio).toBe('Fashion vendor in Douala since 2015');
  });

  test('US-008-C  User updates name', async () => {
    const res = await request(app).put('/api/auth/profile')
      .set(auth(ctx.josephineToken))
      .field('name', 'Josephine Mbarga-Douala');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Josephine Mbarga-Douala');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-009  Admin logs in and views dashboard
// ══════════════════════════════════════════════════════════════════════════
describe('US-009 — Admin Dashboard', () => {
  test('US-009-A  Admin gets dashboard stats', async () => {
    const res = await request(app).get('/api/admin/stats').set(adminH());
    expect(res.status).toBe(200);
    expect(res.body.users).toBeGreaterThanOrEqual(2);
    expect(res.body.stands).toBeGreaterThanOrEqual(2);
    expect(res.body.products).toBeGreaterThanOrEqual(1);
  });

  test('US-009-B  Admin sees all users list', async () => {
    const res = await request(app).get('/api/admin/users').set(adminH());
    expect(res.status).toBe(200);
    const emails = res.body.map((u) => u.email);
    expect(emails).toContain('josephine@test.cm');
    expect(emails).toContain('bello@test.cm');
  });

  test('US-009-C  Admin sees all stands with owner info', async () => {
    const res = await request(app).get('/api/admin/stands').set(adminH());
    expect(res.status).toBe(200);
    expect(res.body[0].owner_name).toBeDefined();
    expect(res.body[0].product_count).toBeDefined();
  });

  test('US-009-D  Admin sees all products with vendor info', async () => {
    const res = await request(app).get('/api/admin/products').set(adminH());
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].vendor_name).toBeDefined();
  });

  test('US-009-E  Admin sees all orders', async () => {
    const res = await request(app).get('/api/admin/orders').set(adminH());
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  US-010  Admin edits product and manages reels
// ══════════════════════════════════════════════════════════════════════════
describe('US-010 — Admin Content Management', () => {
  test('US-010-A  Admin updates product name and price', async () => {
    const res = await request(app).put(`/api/admin/products/${ctx.productId}`)
      .set(adminH())
      .field('product_name', 'Kaba Ngondo Dress (ADMIN EDITED)')
      .field('price_cfa', '40000')
      .field('category', 'fashion');
    expect(res.status).toBe(200);
  });

  test('US-010-B  Admin edit is persisted', async () => {
    const res = await request(app).get(`/api/products/${ctx.productId}`);
    expect(res.body.product_name).toBe('Kaba Ngondo Dress (ADMIN EDITED)');
    expect(res.body.price_cfa).toBe(40000);
  });

  test('US-010-C  Admin creates a reel via admin API', async () => {
    const res = await request(app).post('/api/admin/reels')
      .set(adminH())
      .field('title', 'Admin uploaded reel')
      .field('description', 'This is a test reel from admin')
      .field('user_id', '1');
    // No video file — should return 400
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/video|required/i);
  });

  test('US-010-D  Admin can edit reel title and description', async () => {
    const res = await request(app).put(`/api/admin/reels/${ctx.postId}`)
      .set(adminH())
      .set('Content-Type', 'application/json')
      .send({ title: 'Admin edited title', description: 'Admin edited desc' });
    expect(res.status).toBe(200);
  });

  test('US-010-E  Admin deletes a stand (cascade deletes its products)', async () => {
    // Create a throwaway stand + product
    const su = await register('Throwaway User', 'throw@test.cm');
    const ss = await request(app).post('/api/stands')
      .set(auth(su.token))
      .send({ vendor_name: 'Throwaway Stand', phone_number: '000', city: 'Buea' });
    await request(app).post('/api/products')
      .set(auth(su.token))
      .field('stand_id', String(ss.body.id))
      .field('product_name', 'Throwaway Product')
      .field('price_cfa', '100')
      .field('category', 'general');

    // Admin deletes the stand
    const del = await request(app).delete(`/api/admin/stands/${ss.body.id}`).set(adminH());
    expect(del.status).toBe(200);

    // Verify stand is gone
    const chk = await request(app).get(`/api/stands/${ss.body.id}`);
    expect(chk.status).toBe(404);
  });
});
