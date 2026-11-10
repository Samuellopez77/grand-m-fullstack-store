import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

// Empties every table the tests write to. CASCADE handles the foreign keys.
export async function resetDb() {
  assertTestDatabase();
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE cart_items, carts, addresses, order_items, orders,
                  product_variants, products, users
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

// What cart tests mostly need: a product with one size in stock.
export async function createVariant({ stock = 10, size = 'M', ...productOptions } = {}) {
  const product = await createProduct(productOptions);
  const variant = await prisma.productVariant.create({
    data: { productId: product.id, size, stock },
  });
  return { product, variant };
}

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

let productCounter = 0;

export async function createProduct({
  name = 'Test Hoodie',
  brand = 'Testbrand',
  colour = 'black',
  category = 'HOODIES',
  gender = 'UNISEX',
  price = 2500,
} = {}) {
  productCounter += 1;
  return prisma.product.create({
    data: {
      slug: `test-${productCounter}-${Date.now()}`, // slug must be unique
      name, brand, colour, category, gender, price,
      image: 'test.jpg',
    },
  });
}

export { prisma };