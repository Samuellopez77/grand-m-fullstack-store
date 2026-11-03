# Tasks

Status legend: [x] Done · [...] In progress · [ ] Not started

GitHub issues and milestones are the source of truth for open work. The order
and reasoning are in `docs/PLAN.md`.

## Done

- [x] Express backend, ES Modules, layered structure, `.env` config, centralized errors
- [x] ESLint (backend, run in CI)
- [x] Product scope (`docs/PRODUCT_REQUIREMENT.md`) and roles (`docs/REQUIREMENT_SPECIFICATION.md`)
- [x] PostgreSQL + Prisma schema, migrations, seed
- [x] Auth: register/login/refresh/logout, JWT, role and department middleware (v0.2)
- [x] Cart API for signed-in customers
- [x] Role-gated frontend pages (`account`, `orders`, `staff`, `admin`)
- [x] Test runner (`node:test` + supertest), test database, CI with a Postgres service (`docs/TESTING.md`)

## Now (v0.3)

| Task | Issue | Status |
|---|---|---|
| Products rework: brand, colour, gender, size variants | #20 | [...] |
| Checkout creates an order (atomic stock, idempotency key) | #1 | [ ] |
| Payment status separate from order status | #21 | [ ] |
| Email verification | #10 | [ ] |

## Next

| Task | Issue | Milestone |
|---|---|---|
| UX states pass (skeleton, empty, error, validation, session expired) | to file | v0.4 |
| Performance basics (compression, `select`, `Promise.all`, pooling check) | to file | v0.4 |
| Audit log | #19 | v0.4 |
| Focus trap in cart and mobile menu | #4 | v0.4 |
| Admin dashboard (redirect, API, shell, products, orders, customers, inventory, overview, staff) | #22–#30 | v0.5 |

## Housekeeping

- [ ] #5 "No automated tests exist": tests exist now; close or retitle
- [ ] #6 Branch protection (repo settings)
- [ ] Resolve open questions in `MEMORY.md` (payment provider, order cancellation, delivery model)
- [ ] Choose a host and fill `docs/DEPLOYMENT.md`
- [ ] Frontend tests (none yet; CI runs lint and build)

## Later

From `docs/REQUIREMENT_SPECIFICATION.md` §4: delivery view, customer support
tools, finance (transactions, refunds, reports), site configuration.
