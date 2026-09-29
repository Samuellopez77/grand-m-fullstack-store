# Design

## Design System

No Figma file exists yet — the design system currently lives entirely in code
(`frontend/src/index.css` and `frontend/src/App.css`). This doc reflects what's
actually implemented; update it if the code changes.

- Figma: none yet — code is the source of truth
- Component library: none — custom CSS, no Tailwind/MUI/etc.

### Color palette

Defined as CSS custom properties in `App.css`, with a light-mode override set.

**Dark theme (default):**
| Token | Value | Use |
|---|---|---|
| `--bg` | `#111311` | Page background |
| `--surface` | `#1a1d19` | Cards, header, drawers |
| `--surface-2` | `#242820` | Nested surfaces (product image backgrounds) |
| `--text` | `#f8f5ed` | Primary text |
| `--muted` | `#b7b8ad` | Secondary text |
| `--line` | `rgba(248, 245, 237, .16)` | Borders/dividers |
| `--gold` | `#d9b25c` | Accent — CTAs, active states, prices |
| `--shadow` | `rgba(0, 0, 0, .28)` | Drop shadows |

**Light theme** (`[data-theme='light']`): `--bg` #f4f1e9, `--surface` #fbfaf6,
`--surface-2` #e8e5db, `--text` #20231e, `--muted` #65695e — `--gold` stays
the same accent in both modes. Theme is toggled client-side and persisted to
`localStorage` (`grand-m-theme`).

### Typography

Three typefaces, loaded via Google Fonts in `index.css`:

| Font | Used for |
|---|---|
| **Manrope** | Body text, UI (default, set on `:root`) |
| **Playfair Display** | Headings (`h1`/`h2` across hero, section titles, empty states) — serif, gives an editorial/premium feel against the sans-serif body |
| **DM Mono** | Eyebrows, labels, prices, kickers — monospace used deliberately for small uppercase micro-copy to read as "data/tag"-like |

### Spacing & layout

No formal spacing scale (no design tokens for spacing) — values are
hand-tuned per component in `App.css`. Layout is CSS Grid/Flexbox throughout,
with a `max-width: 1440px` (header) / `1320px` (content sections) container
pattern and three responsive breakpoints: `1100px`, `760px`, `410px`.

## Key User Flows

### Flow 1: Browse → Add to cart → View cart

1. Land on Home → browse category cards or product rails
2. Click a category → `ShopPage` with filter/sort/search
3. Add item(s) to cart (quantity selectable per product) → cart drawer auto-opens
4. Adjust quantity or remove items in the drawer
5. Click Checkout → **not yet implemented** — currently a dead-end button (no backend order creation yet)

### Flow 2: Search

1. Type a query in the header search bar (desktop) → submit
2. Routes to `collections` page with that query pre-filled into the filter
3. Results filter live as the query changes

### Flow 3: Account creation / sign-in

1. Click "Sign in" (header, mobile menu, or footer) → `AuthPage`
2. Toggle between Sign in / Create account
3. Submit form → **currently a dead end** — form shows a static confirmation message but does not call any API yet (auth backend not built)

### Flow 4: Theme switching

1. Click the sun/moon icon in the header
2. Theme toggles instantly, persists across reloads via `localStorage`

## Screens / Pages

| Screen | Route | Purpose |
|---|---|---|
| Home | `#/home` | Hero gallery, category cards, product rails (sneakers/hoodies), editorial banner |
| Collections | `#/collections` | Full catalog, all categories, filter/sort/search |
| Category page | `#/sneakers`, `#/hoodies`, `#/tops` | Same as Collections, pre-filtered to one category |
| About | `#/about` | Brand story, principles, CTA back to shop |
| Sign in | `#/login` | Auth form (not yet wired to backend) |
| Create account | `#/signup` | Auth form (not yet wired to backend) |
| 404 | any unmatched route | Fallback with link back home |
| Cart drawer | overlay, not a route | Slide-in panel — view/adjust items, subtotal, checkout button |

## Accessibility Notes

**Already implemented in the code:**
- `aria-label` on icon-only buttons (menu toggle, search, cart, theme, quantity controls, close buttons)
- `aria-expanded` on the mobile menu toggle
- `aria-hidden` correctly toggled on the mobile menu and cart drawer when closed, with `tabIndex={-1}` on their interactive children to keep hidden panels out of tab order
- Semantic HTML throughout: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>` for product/principle cards
- `role="search"` on the search form

**Not yet addressed — real gaps:**
- No visible focus-state styling beyond browser defaults — should add a visible `:focus-visible` outline using the `--gold` accent for keyboard users
- Color contrast hasn't been formally checked (e.g. `--muted` text on `--surface` backgrounds) — worth running through a contrast checker before calling this done
- No skip-to-content link for keyboard/screen-reader users landing on any page
- Cart drawer and mobile menu use CSS transforms for open/close but don't trap focus — a keyboard user can currently tab out of an open drawer into the page behind it