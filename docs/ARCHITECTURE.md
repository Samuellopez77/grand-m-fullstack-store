# Architecture

## System Overview

A client-server web app: an Express backend serves a JSON API under `/api/*`
and hosts the built frontend as static files, with SPA fallback routing for
everything else. Data is persisted in MongoDB via Mongoose.

```
Browser
   │
   ▼
Express (server.js)
   ├── /api/*  → routes → controllers → (models) → MongoDB
   └── everything else → serves frontend/dist (SPA)
```

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js | <!-- TODO: version pin? --> |
| Web framework | Express 5 | Minimal, unopinionated, huge ecosystem, team familiarity |
| Database | MongoDB | Schema flexibility during early development; document model fits <!-- TODO: fill in why it fits your data --> |
| ODM | Mongoose | Schema validation and structure on top of MongoDB's flexibility |
| Module system | ES Modules | Modern JS standard; consistent `import`/`export` across the codebase |
| Config | dotenv | Keeps secrets/config out of source control |
| Dev tooling | nodemon, ESLint | Fast reload in dev; consistent code style enforced automatically |
| Frontend | <!-- TODO --> | |

## Folder Structure

```
backend/
├── config/       # external service connections (db.js, etc.)
├── controllers/  # business logic per resource
├── middleware/   # cross-cutting concerns (error handling, auth once added)
├── routes/       # HTTP path → controller mapping only, no logic
├── server.js     # entry point — wires everything together
```

As resources are added, each gets one file per layer: e.g. a "users" resource
adds `routes/users.routes.js`, `controllers/users.controller.js`, and
`models/user.model.js`.

## Data Flow

1. Request hits `server.js`
2. If path starts with `/api`, it's routed to the matching file in `routes/`
3. The route calls its controller, which contains the actual logic
4. The controller talks to the database via a Mongoose model (once models exist)
5. Response is returned as JSON
6. Unmatched `/api/*` paths return a JSON `404` (not the frontend's `index.html`)
7. Any thrown/passed error is caught by the centralized `errorHandler` middleware
8. Non-`/api` paths serve the frontend's `index.html` (client-side routing takes over)

## Database Schema

<!-- TODO: no models exist yet. Once the first resource is defined, document
     its schema here — fields, types, relationships, indexes. -->

## API Design Principles

- All endpoints live under `/api/`
- JSON in, JSON out
- Errors return `{ "error": "<message>" }` with an appropriate status code
- See `docs/API.md` for the actual endpoint list

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Fail-fast DB connection | If MongoDB is unreachable at startup, the process exits rather than serving requests it can't fulfill. Silent partial-failure is worse than a loud crash. |
| Centralized error handler | One place formats error responses, instead of inconsistent ad-hoc handling scattered across routes. |
| Explicit `/api` 404 before SPA fallback | Without this, a typo'd API route would silently return the frontend's `index.html` with a `200` instead of failing — a real bug caught during setup. |
| ES Modules over CommonJS | Modern standard; avoids mixing two module systems in one codebase. |
| Layered structure (routes/controllers/models) | Keeps logic testable and swappable independent of HTTP concerns. |