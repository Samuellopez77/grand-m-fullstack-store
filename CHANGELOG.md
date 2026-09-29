# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed
- Migrated backend database from MongoDB/Mongoose to PostgreSQL (hosted on
  Supabase) via Prisma — e-commerce data (User/Order/Product) is fundamentally
  relational, and checkout needs atomic transactions that a single
  relational database handles more naturally than a split or document store
- Rebuilt `backend/` from scratch with corrected ES Module usage throughout
  (previous `server.js` mixed `require()` into a `"type": "module"` project,
  which prevented the server from booting at all)
- Defined initial Prisma schema: `User` (with `role` + `department` for
  staff accounts), `Product`, `Order`, `OrderItem`

### Added
- Initial Express backend scaffold
- Layered structure: `config/`, `routes/`, `controllers/`, `middleware/`
- `.env`-based configuration via `dotenv`
- Centralized error-handling middleware
- Explicit `/api` 404 handling (fixed a bug where unmatched API routes
  silently returned the frontend's `index.html`)
- `/api/health` endpoint
- Project documentation (this file and its siblings)