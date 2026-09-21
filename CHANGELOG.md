# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Initial Express + Mongoose backend scaffold
- Layered structure: `config/`, `routes/`, `controllers/`, `middleware/`
- `.env`-based configuration via `dotenv`
- Centralized error-handling middleware
- Explicit `/api` 404 handling (fixed a bug where unmatched API routes
  silently returned the frontend's `index.html`)
- ESLint (flat config) for code quality checks
- `/api/health` endpoint
- Project documentation (this file and its siblings)

### Changed
- Converted backend from CommonJS to ES Modules
- Renamed `backend/serverside` → `backend`