import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

// Safety guard: refuse to run any reset unless the connection string points
// at the local test database. This stops a misconfigured .env from wiping
// real data.
function assertTestDatabase() {
  const url = process.env.DATABASE_URL ?? '';
  if (!url.includes('@localhost:5433/grandm_test')) {
    throw new Error(
      'Refusing to run tests: DATABASE_URL is not the local test database. ' +
      'Run tests with `npm test`, which loads .env.test.'
    );
  }
}

// Empties every table the tests write to. CASCADE handles the foreign keys.
export async function resetDb() {
  assertTestDatabase();
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE cart_items, carts, addresses, order_items, orders,
                   products, users
    RESTART IDENTITY CASCADE
  `);
}

export async function createCustomer(email = `customer-${Date.now()}-${Math.random()}@test.local`) {
  const user = await prisma.user.create({
    data: { name: 'Test Customer', email, password: 'not-used-in-tests', role: 'CUSTOMER' },
  });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET);
  return { user, token };
}

export async function createProduct({ name = 'Test Hoodie', price = 2500, stock = 10 } = {}) {
  return prisma.product.create({
    data: { name, category: 'hoodies', price, image: 'test.jpg', stock },
  });
}

export { prisma };