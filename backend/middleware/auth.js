// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'cobra-dev-secret';

/**
 * Protect routes with dev session
 */
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Sign JWT for telegram login
 */
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};
