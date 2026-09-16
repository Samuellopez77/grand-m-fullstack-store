# GRAND_M full-stack store

An e-commerce project with a React storefront and an Express/MongoDB backend.

## Project structure

- `frontend/` — active React + Vite application
- `backend/serverside/` — Express server and MongoDB connection

## Development

Run the React app during frontend work:

```bash
cd frontend
npm install
npm run dev
```

For a production-style server, build the frontend first and then start Express:

```bash
cd frontend
npm run build
cd ../backend/serverside
npm start
```
