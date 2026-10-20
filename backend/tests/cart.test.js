import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import {
  requireRole,
  requireDepartment,
  requireOwnershipOrRole,
} from '../middleware/auth.middleware.js';

// Every cart route runs requireAuth first, so these tests don't need a
// database: the request is rejected before any Prisma call happens.
const routes = [
  ['GET', '/api/cart'],
  ['POST', '/api/cart/items'],
  ['PATCH', '/api/cart/items/some-product-id'],
  ['DELETE', '/api/cart/items/some-product-id'],
  ['POST', '/api/cart/merge'],
];

describe('cart routes require authentication', () => {
  for (const [method, path] of routes) {
    test(`${method} ${path} returns 401 without a token`, async () => {
      const res = await request(app)[method.toLowerCase()](path).send({});

      assert.equal(res.status, 401);
      assert.deepEqual(res.body, { error: 'Authentication required' });
    });

    test(`${method} ${path} returns 401 with an invalid token`, async () => {
      const res = await request(app)
        [method.toLowerCase()](path)
        .set('Authorization', 'Bearer not-a-real-token')
        .send({});

      assert.equal(res.status, 401);
      assert.deepEqual(res.body, { error: 'Invalid or expired token' });
    });
  }
});

describe('backend authorization middleware', () => {
  test('requireRole rejects users without the allowed role', () => {
    let nextCalled = false;
    const req = { user: { role: 'CUSTOMER' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    requireRole('ADMIN')(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: 'Insufficient permissions' });
    assert.equal(nextCalled, false);
  });

  test('requireRole allows admin to satisfy staff route checks', () => {
    let nextCalled = false;
    const req = { user: { role: 'ADMIN' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    requireRole('STAFF', 'ADMIN')(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  test('requireDepartment allows an admin and blocks the wrong department', () => {
    let nextCalled = false;
    const req = { user: { role: 'STAFF', department: 'FINANCE' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    requireDepartment('ORDERS')(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: 'Insufficient department permissions' });
    assert.equal(nextCalled, false);

    const adminReq = { user: { role: 'ADMIN', department: null } };
    nextCalled = false;
    requireDepartment('ORDERS')(adminReq, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  test('requireOwnershipOrRole allows a customer to access their own order but blocks another customer', () => {
    let nextCalled = false;
    const req = {
      user: { sub: 'user-1', role: 'CUSTOMER' },
      order: { userId: 'user-1' },
    };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    requireOwnershipOrRole((request) => request.order?.userId, 'ADMIN')(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);

    const blockedReq = {
      user: { sub: 'user-1', role: 'CUSTOMER' },
      order: { userId: 'user-2' },
    };
    nextCalled = false;
    requireOwnershipOrRole((request) => request.order?.userId, 'ADMIN')(blockedReq, res, () => {
      nextCalled = true;
    });

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: 'You do not have access to this order' });
    assert.equal(nextCalled, false);
  });
});