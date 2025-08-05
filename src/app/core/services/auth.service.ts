import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { switchMap } from 'rxjs'; // switch to a new Observable whenever a new value is emitted by the source Observable.

/**
 * AuthService handles all authentication-related operations,
 * including user registration, login, session management, and course enrollment.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient); //Dependency injection  to get an instance of HttpClient.
  private readonly LOGGED_IN_USER_KEY = 'loggedInUser';
  private readonly JWT_TOKEN_KEY = 'token';

  /**
   * Registers a new user by sending their details to the backend.
   * @param username The user's chosen username.
   * @param password The user's chosen password.
   * @param email The user's email address.
   * @returns An Observable of the backend response.
   */
  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post("http://localhost:3000/signup", { username, password, email });
  }

  /**
   * Logs in a user by sending their credentials to the backend.
   * On success, saves the JWT token and user data to localStorage.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns An Observable containing the token and user object.
   */
  login(email: string, password: string): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>("http://localhost:3000/login", { email, password }).pipe(
      tap(response => {  //perform side effects in an Observable stream without modifying the values flowing through it.
        if (response.token && response.user) {
          this.saveToken(response.token);
          this.saveCurrentUser(response.user);
        }
      })
    );
  }

  /**
   * Stores the JWT token in localStorage for future authenticated requests.
   * @param token The JWT token string.
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN_KEY, token);
  }

  /**
   * Stores the currently logged-in user's data in localStorage.
   * @param user The user object to save.
   */
  private saveCurrentUser(user: User): void {
    localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify(user));
  }

  /**
   * Logs out the current user by clearing their data and token from localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.LOGGED_IN_USER_KEY);
    localStorage.removeItem(this.JWT_TOKEN_KEY);
  }

  /**
   * Checks if a user is currently logged in by verifying the presence of a JWT token.
   * @returns True if a token exists, otherwise false.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN_KEY);
  }

  /**
   * Retrieves the currently logged-in user's data from localStorage.
   * @returns The user object if present, otherwise null.
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Fetches the latest user data from the backend and updates localStorage.
   * Useful after actions like enrollment to keep the frontend in sync.
   * @returns An Observable of the user object.
   */
  refreshCurrentUser(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/me").pipe(
      tap(user => {
        this.saveCurrentUser(user);
      })
    );
  }

  /**
   * Enrolls the current user in a course by sending the course ID to the backend.
   * After enrolling, fetches the updated user data to keep localStorage in sync.
   * @param courseId The ID of the course to enroll in.
   * @returns An Observable of the backend response.
   */
  enrollCourse(courseId: string): Observable<any> {
    return this.http.put("http://localhost:3000/enroll-course", { courseId }).pipe(
      switchMap(() => this.refreshCurrentUser())
    );
  }

  /**
   * Unenrolls the current user from a course by sending a request to the backend.
   * @param courseId The ID of the course to unenroll from.
   * @returns An Observable of the backend response.
   */
  unenrollCourse(courseId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/unenroll-course/${courseId}`);
  }

    /**
   * Retrieves all courses the current user is enrolled in.
   * @returns An Observable array of enrolled course objects.
   */
  getEnrolledCourses(): Observable<any[]> {
    return this.http.get<{ enrolledCourses: any[] }>("http://localhost:3000/user-enrolled-courses").pipe(
      map(response => response.enrolledCourses)
    );
  }
}
