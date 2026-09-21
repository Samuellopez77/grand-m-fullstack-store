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
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/Grand_m_users` |
| `NODE_ENV` | Environment mode | `development` |

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