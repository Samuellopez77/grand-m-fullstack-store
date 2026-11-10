import { test, describe, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { resetDb, createCustomer, createVariant, prisma } from './helpers/db.js';

beforeEach(async () => {
  await resetDb();
});

after(async () => {
  await prisma.$disconnect();
});

describe('POST /api/cart/items', () => {
  test('adds a variant and returns the cart totals', async () => {
    const { token } = await createCustomer();
    const { product, variant } = await createVariant({ price: 2500, stock: 10, size: 'M' });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 2 });

    assert.equal(res.status, 201);
    assert.equal(res.body.itemCount, 2);
    assert.equal(res.body.subtotal, 5000);
    assert.equal(res.body.items[0].variantId, variant.id);
    assert.equal(res.body.items[0].productId, product.id);
  });

  test('adding the same variant again increases its quantity', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 10, size: 'M' });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 2 });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 3 });

    assert.equal(res.status, 201);
    assert.equal(res.body.items.length, 1);
    assert.equal(res.body.items[0].quantity, 5);
  });

  test('rejects a total above stock with 409 and leaves the cart unchanged', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 3, size: 'M' });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 4 });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, 'Only 3 available');

    const cart = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(cart.body.itemCount, 0);
  });

  test('rejects a quantity above the 99-unit line limit', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 500, size: 'M' });

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 100 });

    assert.equal(res.status, 400);
  });

  test('rejects an unknown variant with 404', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: '00000000-0000-0000-0000-000000000000', quantity: 1 });

    assert.equal(res.status, 404);
  });

  test('rejects a zero or fractional quantity with 400', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ size: 'M' });

    for (const quantity of [0, 1.5]) {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${token}`)
        .send({ variantId: variant.id, quantity });

      assert.equal(res.status, 400, `quantity ${quantity} should be rejected`);
    }
  });
});

describe('PATCH /api/cart/items/:variantId', () => {
  test('sets the quantity exactly', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 10, size: 'M' });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 2 });

    const res = await request(app)
      .patch(`/api/cart/items/${variant.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 7 });

    assert.equal(res.status, 200);
    assert.equal(res.body.items[0].quantity, 7);
  });

  test('rejects a quantity above stock with 409', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 5, size: 'M' });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 1 });

    const res = await request(app)
      .patch(`/api/cart/items/${variant.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 6 });

    assert.equal(res.status, 409);
  });

  test('returns 404 for a variant that is not in the cart', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ size: 'M' });

    const res = await request(app)
      .patch(`/api/cart/items/${variant.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 1 });

    assert.equal(res.status, 404);
  });
});

describe('DELETE /api/cart/items/:variantId', () => {
  test('removes the item from the cart', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ size: 'M' });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: variant.id, quantity: 1 });

    const res = await request(app)
      .delete(`/api/cart/items/${variant.id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.itemCount, 0);
  });

  test('succeeds when the item is not in the cart (idempotent)', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ size: 'M' });

    const res = await request(app)
      .delete(`/api/cart/items/${variant.id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
  });
});

describe('POST /api/cart/merge', () => {
  test('adds valid items and reports the ones it skipped with a reason', async () => {
    const { token } = await createCustomer();
    const inStock = await createVariant({ stock: 10, size: 'M' });
    const soldOut = await createVariant({ name: 'Sold out', stock: 0, size: 'L' });
    const missingId = '00000000-0000-0000-0000-000000000000';

    const res = await request(app)
      .post('/api/cart/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { variantId: inStock.variant.id, quantity: 2 },
          { variantId: soldOut.variant.id, quantity: 1 },
          { variantId: missingId, quantity: 1 },
          { variantId: inStock.variant.id, quantity: 'lots' },
        ],
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.itemCount, 2);
    const reasons = res.body.skipped.map((s) => s.reason).sort();
    assert.deepEqual(reasons, ['invalid entry', 'out of stock', 'product not found']);
  });

  test('caps merged quantities at stock instead of failing', async () => {
    const { token } = await createCustomer();
    const { variant } = await createVariant({ stock: 4, size: 'M' });

    const res = await request(app)
      .post('/api/cart/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ variantId: variant.id, quantity: 9 }] });

    assert.equal(res.status, 200);
    assert.equal(res.body.items[0].quantity, 4);
    assert.deepEqual(res.body.skipped, []);
  });

  test('rejects a body where items is not an array', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/cart/merge')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: 'not-an-array' });

    assert.equal(res.status, 400);
  });
});

describe('cart ownership', () => {
  test('one customer cannot see another customer\'s cart', async () => {
    const alice = await createCustomer();
    const bob = await createCustomer();
    const { variant } = await createVariant({ size: 'M' });

    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${alice.token}`)
      .send({ variantId: variant.id, quantity: 3 });

    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${bob.token}`);

    assert.equal(res.body.itemCount, 0);
    assert.deepEqual(res.body.items, []);
  });
});
