import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Path to the users data file (relative to backend directory)
const USERS_FILE = './data/users.json';

export class User {
  /**
   * Get all users from the data file.
   * @returns {Array} Array of user objects.
   */
  static getAll() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  /**
   * Save all users to the data file.
   * @param {Array} users - Array of user objects to save.
   */
  static saveAll(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  /**
   * Find a user by email (case-insensitive).
   * @param {string} email - The email to search for.
   * @returns {Object|undefined} The user object if found, otherwise undefined.
   */
  static findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return this.getAll().find(u => u.email.toLowerCase() === normalizedEmail);
  }

  /**
   * Create a new user and save to the data file.
   * @param {Object} param0 - User data ({ name, email, password }).
   * @returns {Object} The newly created user object.
   */
  static create({ name, email, password }) {
    const users = this.getAll();
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password, // already hashed before calling this
      enrolledCourseIds: []
    };
    users.push(newUser);
    this.saveAll(users);
    return newUser;
  }
}

export default User;