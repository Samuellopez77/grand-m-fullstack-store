import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

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