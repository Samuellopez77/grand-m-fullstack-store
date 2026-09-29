# Deployment

## Environments

| Environment | URL | Status |
|---|---|---|
| Local | `http://localhost:3000` | Active |
| Staging | <!-- TODO --> | Not set up |
| Production | <!-- TODO --> | Not set up |

## Required Environment Variables

See `backend/.env.example` for the current list:

| Var | Purpose | Example |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `DATABASE_URL` | Pooled PostgreSQL connection (Supabase, used at runtime) | `postgresql://postgres.[ref]:[password]@[host]:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Direct PostgreSQL connection (used only by Prisma migrations) | `postgresql://postgres.[ref]:[password]@[host]:5432/postgres` |
| `NODE_ENV` | Environment mode | `development` |

Note: if the database password contains special characters (`@`, `#`, `%`,
etc.), they must be percent-encoded in the connection string or Prisma will
fail to parse it correctly.

## Deploy Steps

<!-- TODO: not deployed anywhere yet. Once a host is chosen (Render, Railway,
     Fly.io, a university server, etc.), document the exact steps here. -->

1.
2.

## Rollback Plan

<!-- TODO -->

## Health Checks

`GET /api/health` can be used by a hosting platform's uptime monitor to
confirm the app is alive.