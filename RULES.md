# Development Rules

## General principles

1. **Fail loud, not quiet.** If a required dependency (e.g. the database) isn't available, the app should refuse to serve traffic rather than run in a broken half-state. See `config/db.js`.
2. **No logic in routes.** Routes map paths to controllers only. Business logic lives in controllers (and services, once we need them).
3. **No hardcoded config or secrets.** Everything environment-specific goes through `.env` (see `.env.example` for the required vars). Never commit real secrets.
4. **Centralize error handling.** Don't `try/catch` and format errors ad hoc in every route — throw or `next(err)` and let the shared error handler respond consistently.
5. **Every dependency is a deliberate choice.** Before adding a package, check if the standard library or something already installed covers it.

## Module system

- **ES Modules only** (`import`/`export`). Never `require`/`module.exports` — the project is `"type": "module"`, and mixing the two will break.
- Relative imports between local files need the explicit `.js` extension: `from './config/db.js'`, not `from './config/db'`.

## Naming conventions

- **Files:** `<resource>.<layer>.js` — e.g. `health.controller.js`, `health.routes.js`.
- **Folders:** lowercase, plural where they hold multiple resources (`routes/`, `controllers/`, `models/`).
- **Variables/functions:** `camelCase`.
- **Mongoose models/classes:** `PascalCase`.
- **Env vars:** `SCREAMING_SNAKE_CASE`.

## Code style

- Enforced by `eslint.config.js` — run `npm run lint` before pushing.
- `===` over `==`.
- `const` by default; `let` only when reassignment is genuinely needed.

## Git workflow

<!-- TODO: confirm with the team, adjust to match actual practice -->

- **Branch naming:** `feature/<short-description>`, `fix/<short-description>`, `chore/<short-description>`
- **Commits:** short imperative summary line (e.g. `Add health check endpoint`), body if the "why" isn't obvious from the diff
- **Pull requests:** at least one reviewer approval before merging to `main`
- **No direct pushes to `main`**

## Before opening a PR

- [ ] `npm run lint` passes
- [ ] New env vars (if any) are added to `.env.example`
- [ ] New endpoints (if any) are documented in `docs/API.md`

## Database

- Every new table must have **RLS** enabled in the same migration that creates it:
**ALTER TABLE** public.<table> **ENABLE ROW LEVEL SECURITY**;