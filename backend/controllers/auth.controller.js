import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const authController = {

  /**
   * Signup: Register a new user.
   * - Checks if the user already exists by email.
   * - Hashes the password and creates a new user with name, email, and hashed password.
   * - Responds with a success message or error.
   */
  signup: async (req, res) => {
    // Destructure 'username' from the request body and alias it to 'name' for user creation.
    const { email, password, username: name } = req.body;

    try {
      // Check if a user with the given email already exists
      if (User.findByEmail(email)) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      // Normalize and hash the password
      const normalizedPassword = password.trim();
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

      // Create the new user
      User.create({ name, email, password: hashedPassword });

      // Respond with success
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong! Try again.' });
    }
  },

  /**
   * Login: Authenticate a user.
   * - Finds the user by email.
   * - Compares the provided password with the stored hashed password.
   * - If valid, generates a JWT token and returns user info (excluding password).
   * - Responds with error if authentication fails.
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user by email
      const user = User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email.' });
      }

      // Check if the password is correct
      const normalizedPassword = password.trim();
      const isPasswordValid = await bcrypt.compare(normalizedPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Respond with token and safe user info (do NOT send password)
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong! Try again.' });
    }
  }
}

export default authController;