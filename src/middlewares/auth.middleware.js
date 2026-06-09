import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Not authorized. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user still exists
    const user = await User.findById(decoded.id)
      .select('-password -refreshToken');

    if (!user) {
      return sendError(res, 401, 'User no longer exists.');
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please refresh.');
    }

    return sendError(res, 401, 'Invalid token.');
  }
};