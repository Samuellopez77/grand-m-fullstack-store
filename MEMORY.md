# Decision & Session Log

Running log of significant decisions and debugging sessions on GRAND_M —
why things are the way they are, not just what changed. Useful for future-you
(and anyone else reading this repo) to understand reasoning that a code diff
alone doesn't show.

---

## 2026-09-29 — Role structure defined

Three top-level roles: `ADMIN`, `CUSTOMER`, `STAFF`. Staff is a single role
with a `department` field (rather than five separate roles) — chosen for
flexibility: adding a new department later doesn't require a schema/permission
rewrite, just a new enum value.

Departments, in order of the order lifecycle: Inventory → Orders → Delivery →
Support → Finance. MVP will implement Inventory + Orders first; Delivery/
Support/Finance are designed for but not yet built out.

## 2026-09-29 — Database migration: MongoDB → PostgreSQL + Prisma

Originally scaffolded on MongoDB/Mongoose. Switched after schema design work
surfaced that:
- User/Order/Product relationships are fixed and relational, not
  variable-shape documents — not playing to MongoDB's actual strength
- Checkout requires atomicity (decrement stock + create order must succeed
  or fail together) — native ACID transactions in a relational DB are the
  more natural fit
- Splitting Products (Mongo) from Users/Orders (SQL) was considered and
  rejected — breaks atomic checkout across database boundaries for no real
  benefit, since product data isn't actually irregular enough to need
  MongoDB's flexibility

Chose Supabase as the hosted Postgres provider (free tier, easy dashboard,
generous enough for a practice project) and Prisma as the ORM (type-safe
queries, schema-as-source-of-truth, solid migration tooling).

## 2026-09-29 — Backend rebuilt from scratch

Repeated `npm install` corruption/hangs traced to the project living inside
a OneDrive-synced `Desktop` folder — OneDrive was interfering with
`node_modules` writes (visible as `EFTYPE` errors on `esbuild` binaries).
Moved the whole project to `C:\dev\` (outside any OneDrive-tracked path),
wiped and reinstalled clean.

Separately: `npx prisma init` defaulted to Prisma `8.0.0-rc.17` (a
release-candidate CLI version incompatible with the schema/config approach
used here). Pinned both `prisma` and `@prisma/client` to `6.16.3` explicitly
to resolve.

`server.js` also had a latent bug from the original scaffold: it used
CommonJS `require()` in a `"type": "module"` project, which meant it never
actually booted. Rewritten in proper ESM syntax during the rebuild.

Result: backend now boots clean, connects to Supabase Postgres via Prisma,
and `/api/health` responds correctly.