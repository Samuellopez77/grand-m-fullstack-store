# Tasks

Status legend: [x] Done · [...] In progress · [ ] Not started

## Setup

| Task | Status | Owner |
|---|---|---|
| Scaffold Express backend | [x] | |
| Externalize config to `.env` | [x] | |
| Layered structure (config/routes/controllers/middleware) | [x] | |
| Centralized error handling | [x] | |
| Convert to ES Modules | [x] | |
| Set up ESLint | [x] | |
| Write project documentation (this set of files) | [...] | |
| Define product scope (`docs/PRD.md`) | [x] | |
| Define roles & permissions (`docs/SRS.md`) | [x] | |

## Next Up

| Task | Status | Owner |
|---|---|---|
| Design `User` schema (role, staffType, auth fields) | [ ] | |
| Design `Product` / `Collection` schema | [ ] | |
| Design `Order` / `Cart` schema | [ ] | |
| Implement auth (register/login, password hashing, tokens) | [ ] | |
| Implement role-based authorization middleware | [ ] | |
| Resolve open questions in `MEMORY.md` (payment provider, order cancellation, variants, delivery model) | [ ] | |
| Set up test runner | [ ] | |
| Design frontend structure | [ ] | |
| Set up CI (lint/test on push) | [ ] | |

## Backlog

From `docs/SRS.md` §4 — Functional Requirements:

- Product catalog: browse, search/filter, product detail
- Cart: add/remove/update items, persist across sessions
- Checkout: address, payment, order confirmation
- Order management: status updates, assignment to delivery
- Delivery: assigned-deliveries view, status updates
- Customer support: order/account lookup, notes, refund requests
- Finance: transaction view, refund approval, reports
- Admin: staff account management, site configuration