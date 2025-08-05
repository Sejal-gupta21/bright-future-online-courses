import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Course } from '../../core/models/course.model';

/**
 * CourseService provides methods to interact with course data from the backend.
 * It handles fetching all courses, fetching a single course by ID, and error handling for HTTP requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the complete list of courses from the backend API.
   * The backend response is expected to be an object with a 'courses' property containing an array of Course objects.
   * @returns An Observable that emits an array of Course objects.
   */
  getAllCourses(): Observable<Course[]> {
    return this.http.get<{ courses: Course[] }>(`${this.apiUrl}/courses`).pipe(
      map(response => response.courses), // Extract the courses array from the response
      tap(courses => {
        // Log the number of courses fetched (for debugging or analytics)
        console.log(`Fetched ${courses.length} courses.`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single course by its unique ID.
   * This method fetches all courses and then finds the one with the matching ID.
   * @param id The unique identifier of the course.
   * @returns An Observable that emits the Course object if found, or undefined if not found.
   */
  getCourseById(id: string): Observable<Course | undefined> {
    return this.getAllCourses().pipe(
      map(courses => courses.find(c => c.id === id)),
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors for all service methods.
   * Differentiates between client-side/network errors and backend errors,
   * and logs a descriptive error message to the console.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that emits an error with a user-friendly message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // This branch handles client-side or network errors.
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // This branch handles backend errors (non-2xx status codes).
      errorMessage = `Server Error (Status: ${error.status}): ${error.message || JSON.stringify(error.error)}`;
    }
    // Log the error for debugging purposes.
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


}
