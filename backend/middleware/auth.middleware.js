import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token from the Authorization header.
 * - Checks for the presence of the token.
 * - Verifies the token using the secret key.
 * - Attaches the decoded user info to req.user if valid.
 * - Responds with 403 if token is missing or invalid.
 */
export const verifyToken = (req, res, next) => {
  // Get the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'No token provided. Please login.' });

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token. Please login.' });
    req.user = user; // Attach decoded user info to the request
    next();
  });
};

export default verifyToken;
