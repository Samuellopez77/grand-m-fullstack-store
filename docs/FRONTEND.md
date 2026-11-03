# Frontend

Run and build commands are in `frontend/README.md`; visual direction in
`docs/DESIGN.md`; page list in `docs/PLANNING_USER_PAGES.md`. This file holds
the conventions to follow when adding code.

## Layout

```
frontend/src/
├── App.jsx        # hash router, session restore, page gates
├── api/           # fetch wrappers (auth.js, products.js); all backend calls live here
├── components/    # cart/, home/, layout/, pages/, products/
├── constants/     # navigation.js
└── utils/         # formatPrice.js
```

## Routing and access

- Hash routes (`#/admin`, `#/staff`, `#/orders`). A route is the string after `#/`.
- Gates live in `App.jsx`: `staff` needs `STAFF`, `admin` needs `ADMIN`,
  `profile`/`orders`/`account` need any signed-in user. The backend enforces the
  same rules; the gate only hides the page.
- The base URL comes from `VITE_API_BASE_URL`.

## Session

- Access token (15 min) is kept **in memory only**, never `localStorage`.
- Refresh token is an httpOnly cookie; `restoreSession()` runs on page load.
- On a 401: try refresh once, then send the user to login with a message
  ("You were signed out. Your cart is saved.").

## Screen states (every data screen handles all of these)

| State | Rule |
|---|---|
| Loading | Skeleton of the final layout, not a bare spinner |
| Empty | Say why it is empty and give one next step |
| Error | What went wrong, whose fault, how to fix it, with a retry |
| No results | Show what is available instead (brand/colour search) |
| Validation | Flag the exact field inline with how to fix it |
| Success | Confirm, reassure, show what happens next |

## Performance rules

- Debounce search input; cancel or ignore stale responses.
- Disable a submit button while its request is running (no duplicate calls).
- `loading="lazy"` on product images below the fold.
- Split admin pages with `React.lazy` so customers don't download them.
- Don't optimistically update stock-dependent UI (cart quantities): wait for
  the server's answer, then show the 409 message if needed.
- Don't tune re-renders until a problem is measured.
