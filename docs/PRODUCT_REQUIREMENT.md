# Product Requirements Document

## Product Overview

Grand_M is an e-commerce platform. Customers browse product collections,
add items to a cart, and place orders. Behind the scenes, a small
operations team (admin + specialized staff roles) manages inventory,
fulfills orders, handles deliveries, supports customers, and manages
finances.

<!-- TODO: refine this as more features come into focus -->

## Problem Statement

<!-- TODO: What problem exists today? Who has it, and why does it matter?
     Bad: "There's no good app for X."
     Better: "[Target user] currently does [workaround] to accomplish [task],
     which causes [specific pain: time lost, errors, cost, etc.]" -->

## Goals & Objectives

<!-- TODO: What does success look like? Keep these measurable where possible. -->

- Goal 1:
- Goal 2:
- Goal 3:

## Target Users

| Persona | Description | Primary need |
|---|---|---|
| Customer | Shops the storefront: browses collections, buys products | Find products easily, trust checkout, track orders |
| Admin | Owns the whole operation | Full visibility and control across every function |
| Product/Inventory Manager | Staff | Keep the catalog accurate and stock current |
| Order Manager | Staff | Move orders from placed → fulfilled smoothly |
| Delivery Staff | Staff | Know what to deliver, where, and mark it done |
| Customer Support | Staff | Resolve customer issues without needing engineering |
| Finance Staff | Staff | Track payments, process refunds, reconcile books |

<!-- TODO: any specifics about who the *customers* are — region, what
     kinds of products/collections, typical order size — sharpens this
     further and will inform design & delivery decisions later. -->

## Core Features (MVP scope)

See `docs/SRS.md` for the full functional requirements. Summary:

1. Customer: browse collections, search/filter, view product detail, cart, checkout, place order, view order history
2. Admin: full CRUD over products/collections/orders/staff accounts, dashboard
3. Staff (role-scoped): inventory management, order fulfillment, delivery tracking, customer support, finance/refunds

## Out of Scope (for now)

- Product reviews/ratings
- Wishlist / saved-for-later
- Order cancellation/return self-service (support handles these manually at MVP)
- Multi-currency / multi-language
- Promotions/coupon codes

<!-- TODO: confirm these are actually deferred and not secretly required -->

## Future Scope

- Product reviews & ratings
- Wishlist
- Customer self-service returns/cancellations
- Promotions & discount codes
- Analytics dashboard for admin (sales trends, etc.)

## Success Metrics

<!-- TODO: How will you know if this works? Even for a course project,
     concrete metrics (e.g. "a user can complete X in under N steps")
     read as more professional than "it works well." -->

-