import prisma from '../config/prisma.js';

// GET /api/products
// Supports ?category=sneakers|hoodies|tops and ?sort=price_asc|price_desc|name
export async function getAllProducts(req, res, next) {
  try {
    const { category, sort } = req.query;

    const where = category ? { category } : undefined;

    let orderBy;
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };
    // no sort param → DB's natural order (insertion order), matches
    // the frontend's current "featured" default

    const products = await prisma.product.findMany({ where, orderBy });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
}