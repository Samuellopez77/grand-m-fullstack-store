# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
Defines the functional and non-functional requirements for Grand_M, an
e-commerce platform where customers browse collections, manage a cart, and
place orders, supported by an admin + staff operations team.

### 1.2 Scope
Covers the backend API and the behaviors it must support for each user
role. Frontend-specific requirements (layout, exact screens) belong in
`docs/DESIGN.md` once defined; this document defines *what* must be
possible, not *how it looks*.

## 2. User Roles

| Role | Description |
|---|---|
| **Guest** | Unauthenticated visitor |
| **Customer** | Authenticated shopper |
| **Admin** | Full system access |
| **Staff — Product/Inventory Manager** | Manages catalog and stock |
| **Staff — Order Manager** | Manages order fulfillment |
| **Staff — Delivery Staff** | Executes deliveries |
| **Staff — Customer Support** | Handles customer inquiries |
| **Staff — Finance Staff** | Handles payments/refunds/reporting |

Data model implication: a `User` needs a `role` field (`admin` / `customer`
/ `staff`), and when `role = staff`, a `staffType` field selecting one of
the five staff specializations above. Admin is treated as a superset —
it can do everything every staff type can do, plus staff/user management
and site configuration.

## 3. Permissions Matrix

[x] = full access · [o] = read-only · locked = scoped to own records only · — = no access

| Action | Admin | Inventory Mgr | Order Mgr | Delivery Staff | Cust. Support | Finance Staff | Customer | Guest |
|---|---|---|---|---|---|---|---|---|
| Browse collections/products | [x] | [x] | [x] | — | [x] | — | [x] | [x] |
| Manage products/collections | [x] | [x] | — | — | — | — | — | — |
| Add to cart / checkout | — | — | — | — | — | — | [x] | — |
| View own orders | — | — | — | — | — | — | [x] | — |
| View all orders | [x] | — | [x] | — | [o] | [o] | — | — |
| Update order status | [x] | — | [x] | locked delivery status only | — | — | — | — |
| View/manage assigned deliveries | [x] | — | — | locked | — | — | — | — |
| Handle support inquiries | [x] | — | — | — | [x] | — | — | — |
| Request refund | [x] | — | — | — | [x] (request only) | — | — | — |
| Approve/process refund | [x] | — | — | — | — | [x] | — | — |
| View financial reports | [x] | — | — | — | — | [x] | — | — |
| Manage staff accounts/roles | [x] | — | — | — | — | — | — | — |
| Site configuration | [x] | — | — | — | — | — | — | — |

## 4. Functional Requirements

### 4.1 Authentication & Account Management
- **FR-1.1** Users can register with email + password (customers self-register; staff/admin accounts are created by an Admin).
- **FR-1.2** Users can log in and receive an auth token.
- **FR-1.3** Users can log out (token invalidated/expired).
- **FR-1.4** Users can reset a forgotten password.
- **FR-1.5** Customers can view/edit their own profile and saved addresses.
- **FR-1.6** Admin can create, edit, deactivate staff accounts and assign a `staffType`.

### 4.2 Product Catalog (Guest + Customer read; Inventory Mgr + Admin write)
- **FR-2.1** Anyone (including guests) can browse collections/categories.
- **FR-2.2** Anyone can search and filter products (by category, price range, availability).
- **FR-2.3** Anyone can view a product's detail page (images, price, description, stock status).
- **FR-2.4** Inventory Manager/Admin can create, edit, delete products.
- **FR-2.5** Inventory Manager/Admin can create/edit collections and categories.
- **FR-2.6** Inventory Manager/Admin can update stock levels; system flags low stock.

### 4.3 Cart & Checkout (Customer only)
- **FR-3.1** Customer can add/remove/update quantity of items in their cart.
- **FR-3.2** Cart persists across sessions for a logged-in customer.
- **FR-3.3** Customer can view cart summary (items, subtotal, item count).
- **FR-3.4** Customer can proceed to checkout: select/enter shipping address, select payment method, review order.
- **FR-3.5** System validates stock availability at checkout before confirming.
- **FR-3.6** Placing an order clears the cart and creates an Order record.

### 4.4 Order Management
- **FR-4.1** Customer can view their own order history and current order status.
- **FR-4.2** Order Manager/Admin can view all orders, filter by status.
- **FR-4.3** Order Manager/Admin can update order status (e.g. confirmed → processing → ready for delivery).
- **FR-4.4** Order Manager/Admin can assign an order to a Delivery Staff member.
- **FR-4.5** Customer Support/Finance Staff can view (read-only) order details relevant to their function.

### 4.5 Delivery
- **FR-5.1** Delivery Staff can view only the deliveries assigned to them.
- **FR-5.2** Delivery Staff can update delivery status (out for delivery, delivered, failed attempt).
- **FR-5.3** Admin can view and reassign any delivery.

### 4.6 Customer Support
- **FR-6.1** Customer Support can view a customer's account and order history to assist them.
- **FR-6.2** Customer Support can add internal notes to an order/account.
- **FR-6.3** Customer Support can initiate a refund request (does not approve it — see 4.7).

### 4.7 Finance
- **FR-7.1** Finance Staff can view all payment transactions.
- **FR-7.2** Finance Staff can approve/process refund requests.
- **FR-7.3** Finance Staff can view financial reports (revenue, refunds outstanding).

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Category | Requirement / MVP acceptance target | Current status |
|---|---|---|
| **Security** | Hash passwords with bcrypt (cost factor >= 12); never log passwords, tokens, or secrets; expire access tokens within 15 minutes; return generic 5xx errors; allow browser CORS only from configured origins. | Partial: 5xx details are redacted and CORS is allowlisted. Authentication, token handling, password hashing, and security headers are not implemented. |
| **Authorization** | Every protected route authenticates first, then enforces the server-side role/permission matrix; never trust role claims supplied only by the client. | Not implemented: only the public health route currently exists. |
| **Performance** | In the reference staging environment, API p95 latency <= 500 ms at 50 concurrent users with 10,000 products; health-check p95 <= 200 ms. | Unverified: catalog APIs and load tests do not exist yet. |
| **Availability** | >= 99.5% monthly uptime after production deployment, excluding planned maintenance; publish a health check for monitoring. | Unverified: the app is not deployed and has no uptime monitoring. |
| **Scalability** | Support 50 concurrent users and 10,000 products without manual database intervention; confirm with a repeatable staging load test. | Unverified: no load-test suite or deployed environment. |
| **Usability** | Complete checkout in no more than 4 steps from cart to confirmation; provide specific, actionable validation errors; support 320px-wide screens without horizontal page overflow. | Partial: responsive storefront exists; checkout flow and its error states are not implemented. |
| **Data integrity** | Enforce stock >= 0 and order-item quantity > 0 in the database; create an order and decrement stock in one transaction. | Partial: relational foreign keys exist, but stock/quantity checks and checkout transactions are not implemented. |

Performance, availability, and scalability values are provisional MVP targets. Record the staging hardware, dataset, and load-test results when those requirements are verified; do not report them as achieved before then.

## 6. Assumptions & Constraints

- One staff account has exactly one `staffType` (not multiple specializations at once) — <!-- TODO: confirm, or allow multiple -->
- Admin accounts are created manually/seeded, not self-registered
- Payment provider is not yet chosen — <!-- TODO -->
- Delivery is assumed in-house (assigned to internal Delivery Staff), not a third-party courier integration — <!-- TODO: confirm -->

## 7. Open Questions

<!-- TODO: move these to MEMORY.md once resolved -->

- Can a customer cancel an order themselves, or only via Support?
- Are product variants (size/color) in scope, or single-SKU products only?
- Is there a minimum order value, delivery fee, or delivery zones?
- Payment provider/method(s) to support?