# Testing

## Current Status

No automated tests exist yet. This document describes the intended strategy;
update the "Current Status" section as it becomes reality.

## Strategy

<!-- TODO: pick a test runner and commit to it. Node's built-in `node:test`
     needs zero extra dependencies; Jest is more featureful but heavier. -->

| Layer | What to test | Approach |
|---|---|---|
| Controllers | Business logic in isolation | Unit tests, mock the DB layer |
| Routes | Request → response wiring | Integration tests (e.g. supertest) |
| Models | Schema validation, custom methods | Unit tests against a test DB |

## Manual Testing (available now)

`requests.http` in `backend/` has sample requests for the current endpoints —
usable via the VS Code REST Client extension or similar, without needing
Postman.

## Running Tests

```bash
<!-- TODO: fill in once a test runner is chosen, e.g. `npm test` -->
```

## Coverage Goals

<!-- TODO: even a rough target ("core business logic covered") is better
     than nothing for a course project rubric. -->