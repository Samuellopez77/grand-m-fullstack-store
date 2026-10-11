# Development Rules

## General principles

1. **Fail loud, not quiet.** If a required dependency (e.g. the database) isn't available, the app should refuse to serve traffic rather than run in a broken half-state. See `config/prisma.js`.
2. **No logic in routes.** Routes map paths to controllers only. Business logic lives in controllers (and services, once we need them).
3. **No hardcoded config or secrets.** Everything environment-specific goes through `.env` (see `.env.example` for the required vars). Never commit real secrets.
4. **Centralize error handling.** Don't `try/catch` and format errors ad hoc in every route. Throw or `next(err)` and let the shared error handler respond consistently.
5. **Every dependency is a deliberate choice.** Before adding a package, check if the standard library or something already installed covers it.

## Module system

- **ES Modules only** (`import`/`export`). Never `require`/`module.exports`. The project is `"type": "module"`, and mixing the two will break.
- Relative imports between local files need the explicit `.js` extension: `from './config/prisma.js'`, not `from './config/prisma'`.
- **Import paths must match filenames exactly, including case.** Linux hosts are case-sensitive even though Windows isn't. Check the casing before committing.

## Naming conventions

- **Files:** `<resource>.<layer>.js`, e.g. `health.controller.js`, `health.routes.js`.
- **Singleton clients in `config/`:** `<name>.js`, e.g. `prisma.js`. These don't follow the resource-layer pattern because they aren't tied to a resource.
- **Folders:** lowercase, plural where they hold multiple resources (`routes/`, `controllers/`).
- **Variables/functions:** `camelCase`.
- **Prisma models** (in `schema.prisma`): `PascalCase`.
- **Env vars:** `SCREAMING_SNAKE_CASE`.

## Code style

- Enforced by `eslint.config.js`. Run `npm run lint` before pushing.
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
- [ ] Any new table has RLS enabled in its migration (see Database)

## Database

- **Every new table must have RLS enabled** in the same migration that creates it:
```sql
  ALTER TABLE public.<table> ENABLE ROW LEVEL SECURITY;
```
- The Express API connects through Prisma with a direct Postgres connection, which bypasses RLS. RLS in this project protects tables from the Supabase Data API (`anon` and `authenticated` roles). Access control for the API itself is enforced in middleware, not in RLS.
- Add explicit RLS policies only when a table must be readable or writable through the Data API. Don't add policies just to make Prisma work.
- Schema changes go through Prisma migrations (`npx prisma migrate dev`). Don't edit applied migration files.