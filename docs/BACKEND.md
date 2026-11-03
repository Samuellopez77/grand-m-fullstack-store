# Backend

Setup and commands are in `backend/README.md`; tests in `docs/TESTING.md`;
endpoints in `docs/API.md`. This file holds the conventions to follow when
adding code.

## Layout

```
backend/
├── app.js            # builds the Express app (no listen); tests import this
├── server.js         # listens on PORT
├── routes/           # URL → controller wiring and middleware only
├── controllers/      # request handling and Prisma queries
├── middleware/       # auth.middleware.js (requireAuth, requireRole,
│                     #   requireDepartment, requireOwnershipOrRole), errorHandler.js
├── config/prisma.js  # Prisma Client singleton
├── prisma/           # schema.prisma, migrations/, seed.js
├── scripts/          # provision-local-user.js
└── tests/            # node:test + supertest; helpers/db.js
```

New feature = route file + controller file + tests, registered in `app.js`.

## Conventions

- **Auth**: `requireAuth` first, then `requireRole` / `requireDepartment` /
  `requireOwnershipOrRole`. ADMIN always passes role and department checks.
- **Errors**: `{ "error": "<message>" }` with the right status (400 validation,
  401 no/invalid token, 403 not allowed, 404 missing, 409 conflict such as
  stock). Unknown errors go to `errorHandler.js`.
- **Stock and money**: only inside `prisma.$transaction`, with the atomic
  `updateMany ... where stock >= qty` pattern. Never read-then-write.
- **Checkout**: one idempotency key per attempt, unique `(userId, key)` on orders.
- **Prices** are whole cedis (`Int`). Order items snapshot name, brand, colour,
  size and price at purchase.
- **Schema changes**: edit `schema.prisma`, `prisma migrate dev --create-only`,
  review the SQL, enable RLS on every new table, apply. Add indexes on foreign
  keys and filter columns (Postgres does not index foreign keys by itself).

## Performance rules

- List endpoints paginate on the server (`page`, `limit` with a cap) and sort
  on indexed columns.
- Use Prisma `select` for lists; `include` only where the response needs the
  relation. No queries inside loops (N+1).
- Run independent queries with `Promise.all` (list + count).
- Compression middleware on responses.
- Every call to an outside service (payments, email) gets a timeout.
- `DATABASE_URL` is the pooled connection; `DIRECT_URL` is for migrations only.

## Not doing (on purpose)

Redis caching, background job queue, load balancing, tracing. Revisit only if
measured need appears. See `docs/PLAN.md`.
