// In dev, the Vite server (5173) and Express API (3000) run on different
// ports, so fetches need an absolute URL — set via VITE_API_BASE_URL in
// frontend/.env.local. In production, the frontend is served BY Express on
// the same origin, so a relative path (empty base) works correctly.
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`)
  if (!res.ok) throw new Error('Failed to load product')
  return res.json()
}