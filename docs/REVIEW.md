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

## Suggested order

1. #1-#4 with tests (cart controller), then #5.
2. D1, D5, D6 (cheap, safe).
3. #6 and #7 as plan steps 4 and 5, then apply the migration to Supabase.
4. D4 during v0.5; D2, D3 only if they start to hurt.
