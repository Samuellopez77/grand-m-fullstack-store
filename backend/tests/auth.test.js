import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { resetDb, createCustomer } from './helpers/db.js';

describe('GET /api/auth/me', () => {
  beforeEach(async () => {
    await resetDb();
  });

  test('returns the authenticated user without exposing secrets', async () => {
    const { user, token } = await createCustomer('me-user@test.local');

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: null,
    });
  });

  test('returns 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');

    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { error: 'Authentication required' });
  });

  test('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-real-token');

    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { error: 'Invalid or expired token' });
  });
});
