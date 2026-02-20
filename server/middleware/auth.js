import jwt from 'jsonwebtoken';

// This runs BEFORE every protected route
// It checks the token, finds out WHO is making the request,
// and attaches user info to req.user
export function auth(req, res, next) {
  // Token can come from header or cookie
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: 1, username: 'ali' }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
