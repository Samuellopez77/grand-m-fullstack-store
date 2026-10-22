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
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}

// Staff routes are department-scoped. Admin always passes department checks.
export function requireDepartment(...allowedDepartments) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.role !== 'STAFF') {
      return res.status(403).json({ error: 'Insufficient department permissions' });
    }

    const department = req.user.department ?? null;
    if (!department || !allowedDepartments.includes(department)) {
      return res.status(403).json({ error: 'Insufficient department permissions' });
    }

    return next();
  };
}

// Useful for customer order routes: allow the owner or an admin/special role.
export function requireOwnershipOrRole(getOwnerId, ...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    const ownerId = typeof getOwnerId === 'function' ? getOwnerId(req) : req[getOwnerId];
    const currentUserId = req.user.sub ?? req.user.id;

    if (ownerId && String(ownerId) === String(currentUserId)) {
      return next();
    }

    return res.status(403).json({ error: 'You do not have access to this order' });
  };
}