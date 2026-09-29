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