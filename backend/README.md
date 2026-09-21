# Grand_M — Backend

Node/Express backend for the Grand_M project. Connects to MongoDB via Mongoose
and serves the built frontend (`frontend/dist`) as static files, with SPA
fallback routing.

## Structure

```
backend/
├── config/
│   └── db.js               # MongoDB connection logic
├── controllers/
│   └── health.controller.js
├── middleware/
│   └── errorHandler.js     # centralized error handling
├── routes/
│   └── health.routes.js
├── .env                    # local secrets/config — NOT committed
├── .env.example            # template for required env vars
├── server.js                # app entry point
└── requests.http            # sample API requests (REST Client / Insomnia)
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env template and fill in real values:
   ```
   cp .env.example .env
   ```
3. Make sure MongoDB is running locally (or update `MONGO_URI` to point at
   your instance).
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

## API

| Method | Route         | Description          |
|--------|---------------|-----------------------|
| GET    | `/api/health` | Health check endpoint |

Any other unmatched `/api/*` route returns a `404` JSON response. All other
routes fall back to the frontend's `index.html` (SPA routing).
