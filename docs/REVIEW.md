# Review: errors and duplicates

Snapshot of branch `docs/plan-and-conventions` after the variants commit
(`d31e921`), 2026-11-10. Line numbers are in `backend/` unless stated.

## How this was checked

- Migration SQL applied in order to a fresh Postgres 16: clean. `npm run lint`: clean.
- `npm test` was **not run** (Prisma's engine could not be downloaded in the review environment). Run it locally with the test database up.
- Duplicates: copy-paste detector (`jscpd`, 6+ lines) over `backend/` and `frontend/src/`, plus file hashes, repeated CSS selectors, repeated doc headings.

## Errors

| # | Where | Problem | Effect | Fix |
|---|---|---|---|---|
| 1 | `controllers/cart.controller.js:118` (`updateItem`) | `variantId` is read from the body before the URL | `PATCH /items/A` with `{variantId: B}` changes B | Use `req.params.variantId` only |
| 2 | `cart.controller.js:82-86`, `188-192` | No `product.active` check in `addItem` and `mergeCart` | Archived products can be added to a cart | Treat inactive as "not found" (404 / skipped) |
| 3 | `cart.controller.js:30-44` (`buildCartResponse`) | Lines have no `size`, `brand`, `colour` | Two sizes of one item look identical | Select brand/colour on the product; return `size` from the variant |
| 4 | `cart.controller.js:71`, `118`, `180` | Fallbacks to the old `productId` field | Dead code that hides mistakes | Remove |
| 5 | `tests/cart.behaviour.test.js`, first character | Hidden BOM, not on `main` | Noisy diffs | Re-save as UTF-8 without BOM |
| 6 | `prisma/seed.js:79` | Still writes `stock` on `Product` | Seed fails on the new schema | Rewrite for variants (plan step 4) |
| 7 | `controllers/products.controller.js:4-9` | Lowercase `category` strings vs enum `SHIRTS/HOODIES/SNEAKERS`; no variants, stock or pagination | Products API breaks once the migration is on Supabase | Rewrite (plan step 5). Do not migrate Supabase before this. |

Tests first for #1-#3 (archived product → 404; PATCH uses the URL variant; cart line has size/brand/colour), then the fixes.

Also stale: `frontend/src/products.js` comment says `Product.category` is "just a string"; `categoryDetails` keys (`tops`, `hoodies`, `sneakers`) don't match the enum.

## Duplicates

The reviewer's point holds in places, but code duplication is small: 7 clones, about 2% of lines.

| # | Where | What is repeated | Suggested action |
|---|---|---|---|
| D1 | `controllers/auth.controller.js` ~58-68, ~112-125, ~145-154 | The `{ id, name, email, role, department }` user object and the `res.json({ accessToken, user })` shape, three times | One small `publicUser(user)` helper. Worth doing. |
| D2 | `middleware/auth.middleware.js` 24-32 and 63-71 | The "no `req.user` → 401" guard in `requireRole` and `requireDepartment` | Leave; tiny and clear |
| D3 | `tests/cart.behaviour.test.js` | Request boilerplate (`.set('Authorization', ...)`) in most tests | Optional helper; only if tests grow |
| D4 | `AdminDashboardPage.jsx`, `StaffDashboardPage.jsx`, `OrderHistoryPage.jsx` | Same load/fetch block (7-10 lines) | Shared hook when the admin shell is built (v0.5, #23) |
| D5 | `frontend/src/App.css` | 13 of 376 selectors defined more than once (`.auth-card` ×3, `.auth-page` ×3, `.auth-editorial`, `.auth-submit`, ...) | Merge the rules. Worth doing. |
| D6 | `frontend/public/images/sneakers/` | `Sneaker4.jpeg` and `shoe-13.jpeg` are byte-identical | Delete one, update the reference |
| D7 | `README.md` and `backend/README.md` | Install and migrate commands in both | Keep the full steps in `backend/README.md`, link from the root |
| D8 | `AI.md` (on `docs/ai-usage`, also in the wrong folder) | `## Notes` heading twice | Merge into one section; move to repo root |

Already fixed: duplicate `createProduct` in `tests/helpers/db.js`; redundant
index and duplicate default in the earlier schema draft.

Checked and not duplicates: PRD and SRS (different headings and content), the
frontend and backend product data (the frontend only holds category display
config now).

## Fix instructions

### #1-#4: cart (tests first)

Add these to `tests/cart.behaviour.test.js` and run `npm test`. The first three
should **fail** before the fixes.

```js
// in describe('POST /api/cart/items')
test('rejects an archived product with 404', async () => {
  const { token } = await createCustomer();
  const { product, variant } = await createVariant();
  await prisma.product.update({ where: { id: product.id }, data: { active: false } });

  const res = await request(app)
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${token}`)
    .send({ variantId: variant.id });

  assert.equal(res.status, 404);
});

test('cart lines include size, brand and colour', async () => {
  const { token } = await createCustomer();
  const { variant } = await createVariant({ brand: 'Nike', colour: 'white', size: '42' });

  const res = await request(app)
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${token}`)
    .send({ variantId: variant.id });

  const { size, brand, colour } = res.body.items[0];
  assert.deepEqual({ size, brand, colour }, { size: '42', brand: 'Nike', colour: 'white' });
});

// in describe('PATCH /api/cart/items/:variantId')
test('uses the variant in the URL, ignoring the body', async () => {
  const { token } = await createCustomer();
  const a = await createVariant({ size: 'M' });
  const b = await createVariant({ size: 'L' });
  for (const { variant } of [a, b]) {
    await request(app).post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`).send({ variantId: variant.id });
  }

  const res = await request(app)
    .patch(`/api/cart/items/${a.variant.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ quantity: 5, variantId: b.variant.id });

  const qty = (id) => res.body.items.find((i) => i.variantId === id).quantity;
  assert.equal(qty(a.variant.id), 5);
  assert.equal(qty(b.variant.id), 1);
});
```

Optional fourth test: merge with an archived product lands in `skipped` with
reason `product not found`.

Then change `controllers/cart.controller.js`:

```js
// addItem (line ~71): drop the productId fallback
const { variantId, quantity = 1 } = req.body ?? {};
// ...and replace `const quantity = body.quantity ?? 1;` and the `body` variable
//    (delete the two lines that no longer apply)

// addItem (line ~86) and mergeCart (line ~194): archived counts as missing
if (!productVariant || !productVariant.product.active) throw httpError(404, 'Product not found');
// in mergeCart use the existing branch instead:
//   if (!productVariant || !productVariant.product.active) { skipped.push({ variantId, reason: 'product not found' }); continue; }

// updateItem (line ~118): URL only
const { variantId } = req.params;
const { quantity } = req.body ?? {};

// mergeCart (line ~180): drop the productId fallback
const variantId = entry?.variantId;

// buildCartResponse: select the extra fields...
product: { select: { id: true, name: true, brand: true, colour: true, price: true, image: true } },
// ...and return them
brand: row.variant.product.brand,
colour: row.variant.product.colour,
size: row.variant.size,
```

Done when: `npm run lint` and `npm test` are green and the three new tests pass.

### #5: BOM

In VS Code: open `tests/cart.behaviour.test.js`, click the encoding in the
status bar → **Save with Encoding** → **UTF-8** (not "UTF-8 with BOM").

### #6: `prisma/seed.js`

1. Replace the row shape with `{ name, brand, colour, category, gender, price, image, sizes }`. Use the enum values (`SHIRTS`, `HOODIES`, `SNEAKERS`), `MALE`, and sizes S-XXL for clothing and 40-45 for sneakers.
2. Build `slug` as lowercase `brand-name-colour` with spaces turned into `-`.
3. `createMany` can't create nested rows. Use one `prisma.product.create` per product with `variants: { create: sizes.map((size) => ({ size, stock: 10 })) }`.
4. Clear in FK order: `cartItem`, then `productVariant`, then `product` (`orderItem` too if orders exist; the seed is for development only).
5. Keep it to a handful of products. The CSV import replaces the demo data later.
6. Run it against the test database first: `node --env-file=.env.test prisma/seed.js`.

### #7: `controllers/products.controller.js`

1. Read `category` and `gender` as `value?.toUpperCase()` and check them against the enums. An unknown value returns 400 instead of a Prisma error.
2. Always filter `active: true`. Optional filters: `brand` and `colour` (case-insensitive equals), `minPrice`, `maxPrice`, `q` (case-insensitive `contains` on name, brand, colour).
3. Paginate: `page` (default 1), `limit` (default 20, max 50) with `skip`/`take`. Return `{ items, page, limit, total }`, using `Promise.all([findMany, count])`.
4. Use `select` for lists: `id, slug, name, brand, colour, category, gender, price, image` plus `variants: { select: { id: true, size: true, stock: true } }`.
5. Sorts: `price_asc`, `price_desc`, `name`; default `createdAt desc`, with `id` as tie-break so pages are stable.
6. `getProductById`: include variants; return 404 for archived products.
7. Write `tests/products.test.js`: default list, category filter, brand + colour filter, limit cap, archived hidden, unknown id 404, bad category 400.
8. The list response changes from an array to an object, so `frontend/src/api/products.js` must change in the same PR (plan step 6).

### D1: user object in `auth.controller.js`

Add once near the top:

```js
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, department: u.department ?? null });
```

Replace each of the three `user: { id: user.id, ... }` objects with
`user: publicUser(user)`. Existing auth tests should still pass.

### D5: repeated CSS selectors

List them with:
`grep -E '^[.#a-zA-Z][^{]*\{' frontend/src/App.css | sed 's/ *{.*//' | sort | uniq -c | awk '$1>1'`.
For each, merge the blocks into one. When two blocks set the same property,
keep the later value (it wins today). Check the login and signup pages in the
browser afterwards, and run `npm run build`.

### D6: duplicate image

`git rm frontend/public/images/sneakers/shoe-13.jpeg`, then
`grep -rn "shoe-13" frontend backend` and point any reference at
`Sneaker4.jpeg`. If the seed still lists it, fix that while rewriting the seed (#6).

## Suggested order

1. #1-#4 with tests (cart controller), then #5.
2. D1, D5, D6 (cheap, safe).
3. #6 and #7 as plan steps 4 and 5, then apply the migration to Supabase.
4. D4 during v0.5; D2, D3 only if they start to hurt.
