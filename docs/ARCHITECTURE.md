# Architecture

## System Overview

A client-server web app: an Express backend serves a JSON API under `/api/*`
and hosts the built frontend as static files, with SPA fallback routing for
everything else. Data is persisted in PostgreSQL (hosted on Supabase) via Prisma.

```
Browser
   │
   ▼
Express (server.js)
   ├── /api/*  → routes → controllers → Prisma Client → PostgreSQL (Supabase)
   └── everything else → serves frontend/dist (SPA)
```

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js | <!-- TODO: version pin? --> |
| Web framework | Express 5 | Minimal, unopinionated, huge ecosystem, team familiarity |
| Database | PostgreSQL (Supabase) | E-commerce data is relational by nature (User → Order → Product); ACID transactions needed for atomic checkout (decrement stock + create order together); Supabase gives a hosted instance with zero local setup |
| ORM | Prisma | Type-safe queries generated from schema; first-class migration tooling; schema-as-single-source-of-truth in `schema.prisma` |
| Module system | ES Modules | Modern JS standard; consistent `import`/`export` across the codebase |
| Config | dotenv | Keeps secrets/config out of source control |
| Dev tooling | nodemon | Fast reload in dev |
| Frontend | React 19 + Vite | Fast dev server, modern React, minimal config |

## Folder Structure

```
backend/
├── config/       # external service connections (prisma.js, etc.)
├── controllers/  # business logic per resource
├── middleware/   # cross-cutting concerns (error handling, auth once added)
├── routes/       # HTTP path → controller mapping only, no logic
├── prisma/       # schema.prisma + migration history
├── server.js     # entry point — wires everything together
```

As resources are added, each gets one file per layer: e.g. a "products"
resource adds `routes/products.routes.js`, `controllers/products.controller.js`,
using the `Product` model already defined in 
+`prisma/schema.prisma`.

## Data Flow

1. Request hits `server.js`
2. If path starts with `/api`, it's routed to the matching file in `routes/`
3. The route calls its controller, which contains the actual logic
4. The controller queries the database via the shared Prisma Client (`config/prisma.js`)
5. Response is returned as JSON
6. Unmatched `/api/*` paths return a JSON `404` (not the frontend's `index.html`)
7. Any thrown/passed error is caught by the centralized `errorHandler` middleware
8. Non-`/api` paths serve the frontend's `index.html` (client-side routing takes over)

## Database Schema

Defined in `backend/prisma/schema.prisma`. Current models:

- **User** — `role` (ADMIN / CUSTOMER / STAFF) + optional `department`
  (INVENTORY / ORDERS / DELIVERY / SUPPORT / FINANCE) for staff accounts
- **Product** — catalog items (name, category, price, image, stock)
- **Order** — belongs to a User, has a status and total
- **OrderItem** — join between Order and Product; snapshots `priceAtPurchase`
  so historical orders aren't affected by later price changes

Prices are stored as integers (cents/pesewas) to avoid floating-point
rounding errors.

## API Design Principles

- All endpoints live under `/api/`
- JSON in, JSON out
- Errors return `{ "error": "<message>" }` with an appropriate status code
- See `docs/API.md` for the actual endpoint list

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Fail-fast DB connection | If PostgreSQL is unreachable at startup, the process exits rather than serving requests it can't fulfill. Silent partial-failure is worse than a loud crash. |
| Centralized error handler | One place formats error responses, instead of inconsistent ad-hoc handling scattered across routes. |
| Explicit `/api` 404 before SPA fallback | Without this, a typo'd API route would silently return the frontend's `index.html` with a `200` instead of failing — a real bug caught during setup. |
| ES Modules over CommonJS | Modern standard; avoids mixing two module systems in one codebase. |
| Layered structure (routes/controllers/models) | Keeps logic testable and swappable independent of HTTP concerns. |
| PostgreSQL over MongoDB (migrated) | Originally scaffolded on MongoDB/Mongoose; switched once schema design surfaced that Orders/Products/Users are fundamentally relational and checkout needs atomic transactions. See `MEMORY.md` for the full reasoning. |