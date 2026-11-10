import prisma from '../config/prisma.js';

// Maximum quantity for a single product line in the cart.
const MAX_LINE_QUANTITY = 99;
const MAX_MERGE_ITEMS = 50;

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function isValidQuantity(value) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_LINE_QUANTITY;
}

async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

// Builds the same response shape for every cart endpoint.
async function buildCartResponse(cartId) {
  const rows = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      variant: {
        include: {
          product: { select: { id: true, name: true, price: true, image: true } },
        },
      },
    },
  });

  const items = rows.map((row) => ({
    variantId: row.variantId,
    productId: row.variant.product.id,
    name: row.variant.product.name,
    image: row.variant.product.image,
    unitPrice: row.variant.product.price,
    stock: row.variant.stock,
    quantity: row.quantity,
    lineTotal: row.variant.product.price * row.quantity,
  }));

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

// GET /api/cart
export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.sub);
    res.json(await buildCartResponse(cart.id));
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items  { variantId, quantity? }
// Adds to an existing line or creates one. Rejects anything over stock.
export async function addItem(req, res, next) {
  try {
    const body = req.body ?? {};
    const variantId = typeof body.variantId === 'string' ? body.variantId : body.productId;
    const quantity = body.quantity ?? 1;

    if (typeof variantId !== 'string') throw httpError(400, 'variantId is required');
    if (!isValidQuantity(quantity)) {
      throw httpError(400, `quantity must be an integer from 1 to ${MAX_LINE_QUANTITY}`);
    }

    const cart = await getOrCreateCart(req.user.sub);

    await prisma.$transaction(async (tx) => {
      const productVariant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });
      if (!productVariant) throw httpError(404, 'Product not found');

      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
      });
      const newQuantity = (existing?.quantity ?? 0) + quantity;

      if (newQuantity > productVariant.stock) {
        throw httpError(409, `Only ${productVariant.stock} available`);
      }
      if (newQuantity > MAX_LINE_QUANTITY) {
        throw httpError(400, `You can add at most ${MAX_LINE_QUANTITY} of one item`);
      }

      await tx.cartItem.upsert({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        update: { quantity: newQuantity },
        create: { cartId: cart.id, variantId, quantity: newQuantity },
      });
    });

    res.status(201).json(await buildCartResponse(cart.id));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/cart/items/:variantId  { quantity }
// Sets the quantity exactly. Use DELETE to remove a line.
export async function updateItem(req, res, next) {
  try {
    const body = req.body ?? {};
    const variantId = typeof body.variantId === 'string' ? body.variantId : req.params.variantId;
    const { quantity } = body;
    if (!isValidQuantity(quantity)) {
      throw httpError(400, `quantity must be an integer from 1 to ${MAX_LINE_QUANTITY}`);
    }

    const cart = await getOrCreateCart(req.user.sub);

    await prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        include: { variant: { select: { stock: true } } },
      });
      if (!existing) throw httpError(404, 'Item is not in your cart');
      if (quantity > existing.variant.stock) {
        throw httpError(409, `Only ${existing.variant.stock} available`);
      }

      await tx.cartItem.update({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        data: { quantity },
      });
    });

    res.json(await buildCartResponse(cart.id));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:variantId
// Idempotent: removing an item that isn't there still returns the cart.
export async function removeItem(req, res, next) {
  try {
    const { variantId } = req.params;
    const cart = await getOrCreateCart(req.user.sub);

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });

    res.json(await buildCartResponse(cart.id));
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/merge  { items: [{ variantId, quantity }] }
// Called once at sign-in with the guest cart from localStorage.
// Quantities are added to the server cart and capped at stock.
// Items that can't be added are returned in `skipped`, not as an error.
export async function mergeCart(req, res, next) {
  try {
    const { items } = req.body ?? {};
    if (!Array.isArray(items)) throw httpError(400, 'items must be an array');
    if (items.length > MAX_MERGE_ITEMS) {
      throw httpError(400, `You can merge at most ${MAX_MERGE_ITEMS} items at once`);
    }

    const cart = await getOrCreateCart(req.user.sub);
    const skipped = [];

    await prisma.$transaction(async (tx) => {
      for (const entry of items) {
        const variantId = entry?.variantId ?? entry?.productId;
        const quantity = entry?.quantity;

        if (typeof variantId !== 'string' || !isValidQuantity(quantity)) {
          skipped.push({ variantId: variantId ?? null, reason: 'invalid entry' });
          continue;
        }

        const productVariant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: { product: true },
        });
        if (!productVariant) {
          skipped.push({ variantId, reason: 'product not found' });
          continue;
        }
        if (productVariant.stock < 1) {
          skipped.push({ variantId, reason: 'out of stock' });
          continue;
        }

        const existing = await tx.cartItem.findUnique({
          where: { cartId_variantId: { cartId: cart.id, variantId } },
        });
        const current = existing?.quantity ?? 0;
        const target = Math.min(current + quantity, productVariant.stock, MAX_LINE_QUANTITY);

        if (target === current) {
          skipped.push({ variantId, reason: 'already at maximum' });
          continue;
        }

        await tx.cartItem.upsert({
          where: { cartId_variantId: { cartId: cart.id, variantId } },
          update: { quantity: target },
          create: { cartId: cart.id, variantId, quantity: target },
        });
      }
    });

    res.json({ ...(await buildCartResponse(cart.id)), skipped });
  } catch (err) {
    next(err);
  }
}
