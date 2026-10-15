# Planning: User Pages (Customer, Admin, Staff)

Status: Draft · Date: 2026-10-14 · Owner: team

## 1. Decisions

| Topic | Decision |
|---|---|
| Staff layout | Separate pages per department (`/staff/inventory`, `/staff/orders`, `/staff/delivery`, `/staff/support`, `/staff/finance`) |
| Admin scope | Management plus day-to-day work. Admin can do everything every staff department can do. |
| Order states | `PLACED`, `CONFIRMED`, `PROCESSING`, `READY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `CANCELLED` |
| Email provider | **Resend (free tier). Testing uses your own account email. Use a verified domain only if you deploy publicly.**. Needed for email verification, password reset, and order confirmations. |
| Test runner | Backend: `node:test` + `supertest`. Frontend: Vitest + React Testing Library. |

## 2. Access model

Roles come from the SRS permissions matrix.

- **Backend:** `authenticate` runs first, then `requireRole(...)`. The server is the security boundary. The UI hides actions the user can't take, but it never decides access.
- **Staff routes:** `requireRole('STAFF', '<DEPARTMENT>')`. Admin passes every department check.
- **Frontend:** role-aware routes and navigation. A user who isn't allowed a route gets a 403 page, not a blank screen.

| Role | Can access |
|---|---|
| Guest | Catalog, product detail, sign in, sign up |
| Customer | Everything guest can, plus cart, checkout, own orders, own profile and addresses |
| Staff (department) | That department's pages only |
| Admin | All pages, including staff management, catalog, all orders, and site settings |

## 3. Phases

### Phase 0: Foundations
- [ ] Pick and set up the email provider
- [ ] Add the test runner and enable the test step in CI (closes Issue #5)
- [ ] Add `requireRole` middleware with tests
- [ ] Seed script creates the first ADMIN account
- [ ] Document all new endpoints in `docs/API.md`

### Phase 1: Customer flow
- [ ] Cart: add, update, remove, persist for logged-in customers
- [ ] Checkout: one Prisma transaction that checks stock, decrements it, and creates the order and order items
- [ ] Database constraints: `stock >= 0`, `quantity > 0`
- [ ] Order history from the API
- [ ] Profile and saved addresses
- [ ] Email verification and password reset (requires the provider)

### Phase 2: Admin
- [ ] Staff accounts: create, edit, deactivate, assign department
- [ ] Catalog: products and collections CRUD
- [ ] All orders: list and filter
- [ ] Site settings

### Phase 3: Staff departments
Build in SRS order. Each department is its own PR.

1. **Inventory:** products, stock levels, low-stock flags
2. **Orders:** status updates and assignment to delivery staff
3. **Delivery:** assigned deliveries and delivery status
4. **Support:** customer and order lookup, internal notes, refund requests
5. **Finance:** transactions, refund approval, reports

## 4. Order lifecycle

PLACED → CONFIRMED → PROCESSING → READY → OUT_FOR_DELIVERY → DELIVERED
↘ FAILED
PLACED / CONFIRMED / PROCESSING → CANCELLED


Who can move an order:
- Orders staff: `PLACED → CONFIRMED → PROCESSING → READY`
- Delivery staff: `READY → OUT_FOR_DELIVERY → DELIVERED / FAILED` (own assignments only)
- Admin: any transition
- Customer support: request refunds (SRS FR-6.3). Cancellation rules are an open question. (SRS 4.6)

Transitions are enforced on the server with an allowed-transitions table, not by the UI.

## 5. Testing strategy

| Layer | Tool | Covers |
|---|---|---|
| Backend unit | `node:test` | `requireRole`, transition rules, stock checks |
| Backend integration | `node:test` + `supertest` | Each protected route: 401 without a token, 403 for the wrong role, 200 for the right one |
| Frontend unit | Vitest + RTL | Header, footer, and menu auth states; route guards |
| CI | GitHub Actions | lint, Prisma validate, backend tests, frontend tests, frontend build |

Every new protected route needs a 401 test, a 403 test, and a 200 test before merge.

## 6. Open items

- Email: create the Resend account and get an API key into .env (Phase 0).
- Confirm the seed admin email and how the password is set on first login
- Decide whether `CANCELLED` is allowed after `OUT_FOR_DELIVERY` (current plan: no)

## 7. Out of scope for this doc

Payments, reviews, wishlists, promotions, and courier integration (see `docs/PRODUCT_REQUIREMENT.md`).