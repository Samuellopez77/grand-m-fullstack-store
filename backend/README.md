# Grand_M — Backend

Node/Express backend for the Grand_M project. Connects to PostgreSQL (hosted
on Supabase) via Prisma, and serves the built frontend (`frontend/dist`) as
static files, with SPA fallback routing.

## Structure

```
backend/
├── config/
│   └── prisma.js            # Prisma Client singleton
├── controllers/
│   └── health.controller.js
├── middleware/
│   └── errorHandler.js      # centralized error handling
├── routes/
│   └── health.routes.js
├── prisma/
│   ├── schema.prisma        # data models: User, Product, Order, OrderItem
│   └── migrations/          # generated migration history
├── .env                      # local secrets/config — NOT committed
├── .env.example               # template for required env vars
├── server.js                   # app entry point
└── requests.http                # sample API requests (REST Client / Insomnia)
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env template and fill in real values (Supabase connection strings —
   see Project Settings → Connect in your Supabase dashboard):
   ```
   cp .env.example .env
   ```
3. Apply the Prisma schema to your database (creates tables if they don't exist):
   ```
   npx prisma migrate dev
   ```
4. Run in dev mode (auto-restarts on change):
   ```
   npm run dev
   ```
   or in production mode:
   ```
   npm start
   ```

The server starts on `http://localhost:3000` by default (override with `PORT`
in `.env`).

## Local admin and staff preview

The preview accounts use the throwaway `grandm_test` database only. Start
Docker Desktop first, then run these commands from `backend`:

```powershell
npm run test:db:up
npm run test:db:migrate
npm run provision:local
npm run dev:local
```

The provisioning command prompts for an account name, email, role, staff
department (if applicable), and password. It refuses to run unless the
database URL points to `localhost:5433/grandm_test`. Do not use real or
production credentials in this test database.

In a second terminal, start the frontend from `frontend` with `npm run dev`.
Sign in with the account you just provisioned, then open `/#/admin` or
`/#/staff`. Public signup creates customer accounts only.

The backend tests truncate the test database, so running `npm test` removes
these preview accounts. Re-run `npm run provision:local` afterward if needed.

## Database

Schema is defined in `prisma/schema.prisma` and managed with Prisma Migrate.
To inspect data directly, run `npx prisma studio` for a local GUI against
your Supabase database.

## API

| Method | Route         | Description          |
|--------|---------------|-----------------------|
| GET    | `/api/health` | Health check endpoint |

Any other unmatched `/api/*` route returns a `404` JSON response. All other
routes fall back to the frontend's `index.html` (SPA routing).