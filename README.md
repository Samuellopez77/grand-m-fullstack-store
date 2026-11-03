# GRAND_M full-stack store

An e-commerce project with a React storefront and an Express/PostgreSQL backend.

## Project structure

- `frontend/` — active React + Vite application
- `frontend/public/images/landing/` — professionally named landing-gallery images
- `backend/` — Express server, Prisma schema, and PostgreSQL (Supabase) connection

## Development

Run the React app during frontend work:

```bash
cd frontend
npm install
npm run dev
```

Run the API during backend work:

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

For a production-style server, build the frontend first and then start the backend:

```bash
cd frontend
npm run build
cd ../backend
npm start
```

The landing page automatically cycles through the images in `frontend/public/images/landing/`.

## Documentation

- `docs/PLAN.md`: roadmap and order of work
- `docs/BACKEND.md`, `docs/FRONTEND.md`: conventions for new code
- `docs/TESTING.md`: running and writing tests
- `TASKS.md`, `MEMORY.md`: status and decision log
