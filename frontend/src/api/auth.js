const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// The access token lives only in this module variable (i.e. in memory).
// It is never written to localStorage, so a page refresh clears it, and
// the httpOnly refresh cookie is what brings it back (see restoreSession).
let accessToken = null

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api/auth${path}`, {
    ...options,
    // Required so the browser sends/accepts the httpOnly refresh cookie
    // across origins (5173 -> 3000 in dev). Pairs with `credentials: true`
    // in the backend's CORS config.
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'Something went wrong')
  return data
}

export async function register({ name, email, password }) {
  const data = await request('/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
  accessToken = data.accessToken
  return data.user
}

export async function login({ email, password }) {
  const data = await request('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  accessToken = data.accessToken
  return data.user
}

export async function logout() {
  await request('/logout', { method: 'POST' })
  accessToken = null
}

// Called once on app load. If the browser still has a valid refresh cookie,
// the server hands back a fresh access token and we're "logged in" again
// without the user typing anything. If not, we just stay logged out.
export async function restoreSession() {
  try {
    const data = await request('/refresh', { method: 'POST' })
    accessToken = data.accessToken
    return true
  } catch {
    return false
  }
}

export const getAccessToken = () => accessToken