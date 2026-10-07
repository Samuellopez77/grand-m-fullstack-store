import jwt from 'jsonwebtoken';

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded payload to req.user for any route that needs to know who's
// calling. Use this on any route that should require login.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // { sub, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Restricts a route to specific roles, e.g. requireRole('ADMIN').
// Must run AFTER requireAuth on the same route, since it reads req.user.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}