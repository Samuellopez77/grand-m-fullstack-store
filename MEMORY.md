# Memory / Decision Log

Running log of decisions made and why — so context isn't lost as the team
(or time) moves on. Add a dated entry whenever a non-obvious choice is made.

## Decisions

### 2026-09-21 — Backend restructured
Moved from a single `server.js` doing everything to a layered structure
(`config/`, `routes/`, `controllers/`, `middleware/`). Reason: a single file
doesn't scale past a couple of routes and made the project harder to review.

### 2026-09-21 — Config externalized
`MONGO_URI` and `PORT` moved from hardcoded values into `.env` (via
`dotenv`). Reason: hardcoded secrets/config break the moment you deploy,
add a teammate, or rotate credentials.

### 2026-09-21 — Fail-fast DB connection
If MongoDB is unreachable at startup, the process exits instead of running
in a degraded state. Reason: a "server" that can't reach its database
shouldn't pretend to be healthy.

### 2026-09-21 — Folder renamed `backend/serverside` → `backend`
Reason: "backend" and "serverside" were redundant naming.

### 2026-09-21 — Converted CommonJS → ES Modules
Switched `require`/`module.exports` to `import`/`export` project-wide.
Reason: team preference for the modern JS module standard.

### 2026-09-21 — Added ESLint
Flat config (`eslint.config.js`), catches unused vars, `==` vs `===`,
undefined globals. Reason: catches mistakes (like a stray leftover
`require` in an ESM project) automatically instead of relying on manual review.

### 2026-09-21 — Product domain defined
Grand_M is an e-commerce platform: browse collections, cart, checkout,
place orders. Documented in `docs/PRD.md`.

### 2026-09-21 — Roles defined
Three top-level roles: Admin, Customer, Staff. Staff splits into five
specializations: Product/Inventory Manager, Order Manager, Delivery Staff,
Customer Support, Finance Staff. Admin treated as a superset of all staff
permissions. Full breakdown and permissions matrix in `docs/SRS.md`.

## Open Questions

- What's the first resource/model to build (likely `User` with role/staffType, or `Product`)?
- Frontend framework/tooling — not yet decided
- Test runner — not yet decided
- Deployment target — not yet decided
- Payment provider — not yet decided (see `docs/SRS.md` §6 Assumptions & Constraints)
- Can a customer self-cancel an order, or only via Support? (see `docs/SRS.md` §7)
- Product variants (size/color) in scope for MVP, or single-SKU only?
- Delivery: in-house staff only, or third-party courier integration later?