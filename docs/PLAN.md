# Plan

How the open issues and the newly triaged UX/performance ideas fit together.
Issues and milestones on GitHub are the source of truth for status; this file
holds the **order** and the **reasoning**.

Rule for every step: bugs get a failing test first, then the fix. Anything
touching money or stock gets its failure-case test before the happy path.

## Where we are

- Done: auth (v0.2), cart API, role-gated pages, backend tests + CI with a
  Postgres service, ESLint, testing docs.
- In progress: **#20 products rework** (brand, colour, gender, size variants).
  Schema and migration are applied to the test database only, not to Supabase.
- Not started: checkout, payment status, email verification, admin v0.5,
  UX-states pass, performance pass.

## Order of work

### v0.3: products and checkout

1. **#20 Variants** (finish before anything else; everything below depends on it)
   1. `tests/helpers/db.js`: remove the old duplicate `createProduct`
   2. Cart: `cart.controller.js` and `cart.routes.js` to `variantId`, update cart tests
   3. `npm run lint` and `npm test` green
   4. `prisma/seed.js` for the new schema
   5. `products.controller.js`: pagination, filters (category, gender, brand, colour, price), search, `select` only the needed columns, `Promise.all` for list + count. Tests include a no-N+1 check.
   6. Frontend: `api/products.js`, shop and product pages (variant picker, `loading="lazy"` on images)
   7. `docs/API.md`
   8. Apply the migration to Supabase (the `DELETE` lines remove the 53 demo products; orders and cart items are empty)
   9. CSV import script (Samuel writes it, reviewed afterwards). Convert images to WebP here, once.
2. **#1 Checkout**: one transaction (atomic `updateMany ... where stock >= qty`, create order, clear cart). Idempotency key per attempt, unique `(userId, key)`. Done when: two buyers racing for the last unit yields one order and one 409; a double-click or retry yields one order. Frontend disables the button while the request runs.
3. **#21 Payment status**, separate from order status. When a provider is chosen: set a timeout on its API calls and show a retry state.
4. **#10 Email verification**, required before checkout. Same timeout rule for the email provider.

### v0.4: quality

5. **UX states pass** (new issue): skeleton loading, empty states (cart, orders, no products), error states (409 "only N left", failed checkout), inline form validation, session expired (401 → refresh → login with a message), no-results with suggestions, order-success page (after #1).
6. **Performance basics** (new issue): `compression` middleware (check the host first), debounced search, `select` on all list endpoints, `Promise.all` for independent queries, check `DATABASE_URL` uses the pooler port and the backend runs in the same region as Supabase.
7. **#19 audit log**, **#4 focus trap**, **#5 tests** (close or retitle: tests now exist), **#6 branch protection** (repo settings, close by hand).

### v0.5: admin

8. **#22 redirect after login**, then **#24 admin API foundation**, then **#23 shell** (split admin pages with `React.lazy` so customers don't download admin code).
9. Pages in this order: **#25 products**, **#26 orders**, **#28 customers**, **#29 inventory**, **#27 overview**, **#30 staff dashboard**. Admin tables reuse the catalogue pagination.

## Triage of ideas

Source: two sets of short UX and backend tips.

| Decision | Items |
|---|---|
| Now (steps above) | pagination, N+1, duplicate-call prevention, debounce, compression, `select`, parallel queries, lazy images, skeletons, empty/error/validation/session-expired/no-results/success states, indexes (done) |
| Later | WebP/AVIF (at import), CDN, offline banner, depcheck, font weights, API timeouts (with #21, #10), `React.lazy` (with v0.5) |
| Skip | Redis, job queue, SSR, load balancer, virtualized lists, optimistic UI (conflicts with stock checks), re-render tuning (until measured), OpenTelemetry/monitoring, third-party scripts, AI streaming, camera-permission state |

## Open questions

- Where will product images live after import (hotlinked, Supabase Storage, repo)?
- Where will the backend be deployed? (`docs/DEPLOYMENT.md` has no host yet.)
- Payment provider (open in `MEMORY.md`).
