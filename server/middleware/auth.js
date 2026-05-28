const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (JWT_SECRET) => async (req, res, next) => {
  const bearerToken = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const token = bearerToken || req.cookies.accessToken;

  if (!token) return res.status(401).json({ error: 'Unauthorized', message: 'Access token is required.' });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired access token.' });
  }

  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ error: 'Unauthorized', message: 'User account no longer exists.' });

  req.user = user;
  next();
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (allowedRoles.length === 0) return next();
  if (allowedRoles.includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
};

module.exports = { authenticate, authorize };
