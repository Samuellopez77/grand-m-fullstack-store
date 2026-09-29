# Security

## Reporting a Vulnerability

<!-- TODO: add a real contact — an email or a private channel, not a
     public GitHub issue, so reports aren't visible before they're fixed -->

If you discover a security issue, please report it to: `<TODO>`

## Current Practices

- Secrets/config are kept in `.env`, which is gitignored and never committed
- `.env.example` documents required variables without real values
- Database connection fails fast rather than running in a degraded/insecure state
- 5xx responses return a generic message; stack traces are logged server-side
  only and are not sent to clients
- CORS is restricted to configured origins (local Vite origins are the
  development default; production cross-origin access must be configured)

## Known Gaps (to address)

<!-- TODO: be honest here — this list is a strength for a course project,
     not a weakness. It shows awareness. -->

- No input validation/sanitization yet
- No rate limiting
- No authentication/authorization yet
- No `helmet` or other HTTP security headers middleware yet
- No dependency vulnerability scanning in CI yet
- Rotate any database credentials that were previously present in the tracked
  environment template; use placeholders in `.env.example` and real values only
  in the ignored local `.env` or the deployment secret manager