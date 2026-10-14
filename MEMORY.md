# Decision & Session Log

Running log of significant decisions and debugging sessions on GRAND_M —
why things are the way they are, not just what changed. Useful for future-you
(and anyone else reading this repo) to understand reasoning that a code diff
alone doesn't show.

---

## 2026-09-29 — Role structure defined

Three top-level roles: `ADMIN`, `CUSTOMER`, `STAFF`. Staff is a single role
with a `department` field (rather than five separate roles) — chosen for
flexibility: adding a new department later doesn't require a schema/permission
rewrite, just a new enum value.

Departments, in order of the order lifecycle: Inventory → Orders → Delivery →
Support → Finance. MVP will implement Inventory + Orders first; Delivery/
Support/Finance are designed for but not yet built out.

## 2026-09-29 — Database migration: MongoDB → PostgreSQL + Prisma

Originally scaffolded on MongoDB/Mongoose. Switched after schema design work
surfaced that:
- User/Order/Product relationships are fixed and relational, not
  variable-shape documents — not playing to MongoDB's actual strength
- Checkout requires atomicity (decrement stock + create order must succeed
  or fail together) — native ACID transactions in a relational DB are the
  more natural fit
- Splitting Products (Mongo) from Users/Orders (SQL) was considered and
  rejected — breaks atomic checkout across database boundaries for no real
  benefit, since product data isn't actually irregular enough to need
  MongoDB's flexibility

Chose Supabase as the hosted Postgres provider (free tier, easy dashboard,
generous enough for a practice project) and Prisma as the ORM (type-safe
queries, schema-as-source-of-truth, solid migration tooling).

## 2026-09-29 — Backend rebuilt from scratch

Repeated `npm install` corruption/hangs traced to the project living inside
a OneDrive-synced `Desktop` folder — OneDrive was interfering with
`node_modules` writes (visible as `EFTYPE` errors on `esbuild` binaries).
Moved the whole project to `C:\dev\` (outside any OneDrive-tracked path),
wiped and reinstalled clean.

Separately: `npx prisma init` defaulted to Prisma `8.0.0-rc.17` (a
release-candidate CLI version incompatible with the schema/config approach
used here). Pinned both `prisma` and `@prisma/client` to `6.16.3` explicitly
to resolve.

`server.js` also had a latent bug from the original scaffold: it used
CommonJS `require()` in a `"type": "module"` project, which meant it never
actually booted. Rewritten in proper ESM syntax during the rebuild.

Result: backend now boots clean, connects to Supabase Postgres via Prisma,
and `/api/health` responds correctly.

## 2026-09-30 — .env leaked to public GitHub repo

`backend/.env` (real Supabase credentials, password included) was committed
and pushed to the public repo. Root cause: no `backend/.gitignore` existed —
only the root `.gitignore` (which just excludes `node_modules`) was in place,
so `.env` was never excluded from tracking.

Fixed by: deleting the compromised Supabase project entirely (no real data
existed yet, so nothing lost — stronger than just rotating the password,
since the host itself stops existing), adding `backend/.gitignore` with
`.env` *before* creating the replacement project, untracking the old file
with `git rm --cached`, then re-running `prisma migrate dev` against the
fresh database. `.env.example` was confirmed to only ever contain
placeholders — safe to keep tracked.

Lesson: every subfolder with its own secrets needs its own `.gitignore`
check — a root-level one doesn't automatically cover nested folders' needs.

## 2026-09-30 to 2026-10-04 — Local work sat unpushed for a full session

Built the seed script, Products API, live frontend wiring, mobile menu fix,
and the CI workflow — all confirmed working locally (including visually, in
the browser) — but none of it was actually committed/pushed until explicitly
checked. Commit messages were drafted in conversation but `git add/commit/push`
never followed, so GitHub stayed several steps behind local reality with no
obvious signal that anything was wrong.

Caught by deliberately re-pulling the live repo and diffing it against what
was expected, rather than assuming "I ran the commands we talked about"
meant they'd actually been run.

Once pushed, CI caught two real issues immediately:
- `frontend/src/api/products.js` had been saved as `api-products.js` instead
  (download-card filename vs. the name the import statement expected) —
  broke the Vite build with an unresolved import
- `prisma validate` in CI failed because `DATABASE_URL`/`DIRECT_URL` weren't
  set in the workflow — Prisma needs the env vars to *exist* (placeholder
  values are fine) even for a connection-less schema check

Lesson: "it works on my machine" and "it's on GitHub" are different claims —
verify the second one directly (`git status`, or re-pull the repo) instead
of inferring it from the first. This is exactly what CI is for: it caught
both issues within minutes of actually being run for the first time.

## 2026-10-07: Authentication (Milestone v0.2)

**Decision:** We handle auth ourselves with JWTs. We do not use Supabase Auth.
Supabase is only the Postgres host, and all database access goes through Express and Prisma.

**Token design**
- Access token: JWT, 15 minutes, sent as `Authorization: Bearer`, kept **in memory only** on the frontend (never `localStorage`).
- Refresh token: JWT, 7 days, in an `httpOnly`, `SameSite=Strict` cookie scoped to `/api/auth`.
- On page load the frontend calls `/refresh` to restore the session.
- Why: a script injected by XSS cannot read an httpOnly cookie, and a stolen access token expires in minutes.

**Other decisions**
- Passwords hashed with bcrypt, cost 12.
- Register always sets `role: 'CUSTOMER'`. ADMIN and STAFF accounts will be seeded or created by an admin, never through public signup.
- Wrong email and wrong password return the same 401 message, to prevent account enumeration.
- CORS allows credentials; the cookie is `secure` in production.

**Deferred**
- Email verification (issue filed, v0.3): needs an email provider; required before checkout.
- Password reset by email (same dependency).
- Auth tests (tracked in the tests issue).
- Logout button, account page and signed-in header (small follow-up PR).

**Lessons**
- Both ternaries in `submitForm` ran in sequence, so each submit called the handler twice. Use `if / else`, not stacked ternaries, to choose an action.
- `npm run lint` catches syntax slips (a stray `}` here) before CI does.