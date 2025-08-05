/**
 * User model interface for authentication and registration.
 */
export interface User {
  username: string;
  password: string;
  email: string;
  enrolledCourses?: string[];
}