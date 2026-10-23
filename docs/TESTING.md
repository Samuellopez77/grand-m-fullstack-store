# Testing

## Current Status

Backend tests exist and run in CI on every pull request.

| Area | Covered |
|---|---|
| Auth | `GET /api/auth/me` (valid token, missing token, invalid token) |
| Cart API | add / update / delete / merge, stock limit (409), 99-unit line cap, validation (400), unknown product (404), cart ownership between customers, 401 on every route without a token |
| Authorization middleware | `requireRole`, `requireDepartment`, `requireOwnershipOrRole` (unit tests) |
| Platform | `GET /api/health`, unknown `/api` routes return JSON 404 |

Not covered yet: register/login/refresh/logout flows, products API, orders,
and the whole frontend (CI runs lint and build only).

## Strategy

Runner: Node's built-in `node:test`, with `supertest` for HTTP requests. No
extra test framework.

| Layer | What to test | Approach |
|---|---|---|
| Middleware | Role and ownership rules | Unit tests, no database |
| Routes + controllers | Request → response behaviour | Integration tests with supertest against a **real Postgres test database** |
| Database rules | Stock checks, constraints, cascades | Same integration tests, since the rules live in the DB and transactions |

We test against a real database instead of mocking Prisma, because the
important behaviour (stock limits inside transactions, foreign keys, unique
constraints) only exists in the database.

## Test Database

Tests **delete all rows** before each test (`resetDb()` in
`tests/helpers/db.js`). They must never run against the real Supabase
database. To make that impossible, `resetDb()` refuses to run unless
`DATABASE_URL` contains `@localhost:5433/grandm_test`.

The test database is a throwaway Postgres 16 on `localhost:5433`, database
`grandm_test`, user `test`, password `test`.

### Setup with Docker

From `backend/`:

```bash
npm run test:db:up        # start the container and wait until healthy
npm run test:db:migrate   # apply Prisma migrations to it
npm test
npm run test:db:down      # remove the container and its data
```

### Setup without Docker (Windows, PowerShell)

Docker needs virtualization enabled in the BIOS, which isn't always possible.
A second Postgres cluster from a normal Postgres 16 install works the same way:

```powershell
$pg = "C:\Program Files\PostgreSQL\16\bin"
& "$pg\initdb.exe" -D C:\dev\pgtest -U test --auth=trust
& "$pg\pg_ctl.exe" -D C:\dev\pgtest -o "-p 5433" -l C:\dev\pgtest\log.txt start
& "$pg\createdb.exe" -h localhost -p 5433 -U test grandm_test
```

Then, from `backend/`, run `npm run test:db:migrate` and `npm test`.

The cluster does not start automatically after a reboot. Start it again with
the `pg_ctl ... start` line above. Stop it by replacing `start` with `stop`.

### Environment file

Create `backend/.env.test` (it is gitignored):

```
DATABASE_URL="postgresql://test:test@localhost:5433/grandm_test"
DIRECT_URL="postgresql://test:test@localhost:5433/grandm_test"
JWT_ACCESS_SECRET=any-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
```

## Running Tests

```bash
cd backend
npm test
```

`npm test` loads `.env.test` and runs with `--test-concurrency=1`, so test
files run one at a time and don't wipe each other's data.

If most tests fail with `Can't reach database server at localhost:5433`, the
test database isn't running. Start it first.

## Continuous Integration

`.github/workflows/ci.yml` runs on every pull request to `main`. The backend
job starts a `postgres:16` service container on port 5433, applies migrations,
and runs the tests with the same variables as `.env.test`. The frontend job
runs lint and build.

## Manual Testing

`requests.http` in `backend/` has sample requests for the API, usable with the
VS Code REST Client extension or similar, without needing Postman.

## Coverage Goals

No numeric target. Rule of thumb: every new endpoint ships with tests for
success, validation failure, authentication (401), and authorization (403 or
ownership) where they apply. Anything involving money or stock gets a test
for the failure case first.