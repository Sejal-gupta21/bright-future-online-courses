import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../core/models/course.model'; 
import { CourseService } from '../../../core/services/course.service'; 
import { AuthService } from '../../../core/services/auth.service';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * MyCoursesComponent displays all courses the current user is enrolled in.
 * It handles loading, error, and empty states, and allows the user to start a course.
 */
@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  enrolledCourses: Course[] = [];
  isLoading = true;
  hasNoCourses = false;
  error: string | null = null; // Stores any error message

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that loads the user's enrolled courses on component initialization.
   */
  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  /**
   * Loads the list of courses the user is enrolled in.
   * Handles loading, error, and empty states.
   */
  // loadEnrolledCourses(): void {
  //   this.isLoading = true;
  //   this.error = null; // Reset error on new load attempt

  //   this.authService.getEnrolledCourses().pipe(
  //     switchMap(enrolledIds => {
  //       if (enrolledIds.length === 0) {
  //         this.hasNoCourses = true;
  //         this.isLoading = false;
  //         return of([]); // Return an observable of an empty array
  //       }
        
  //       this.hasNoCourses = false;
  //       // Fetch all courses and filter to only those the user is enrolled in
  //       return this.courseService.getAllCourses().pipe(
  //         map(allCourses => {
  //           return allCourses.filter((course: { id: string; }) => enrolledIds.includes(course.id));
  //         })
  //       );
  //     }),
  //     catchError(err => {
  //       // Handles errors from the observable pipe.
  //       this.error = err.message || 'An unknown error occurred while fetching your courses.';
  //       this.isLoading = false;
  //       return of([]); // Return an empty array to prevent breaking the stream
  //     })
  //   ).subscribe({
  //     next: (filteredCourses) => {
  //       this.enrolledCourses = filteredCourses;
  //       this.isLoading = false;
  //       if (this.enrolledCourses.length === 0 && !this.error) {
  //           this.hasNoCourses = true;
  //       }
  //     }
  //     // Note: Error handling is now done inside the catchError operator
  //   });
  // }

   loadEnrolledCourses(): void {
    this.isLoading = true;
    this.error = null; // Reset error on new load attempt

    this.authService.getEnrolledCourses().pipe(
      // If your backend returns full course objects, you don't need to fetch all courses and filter.
      // If it returns only IDs, keep the filtering logic.
      map((enrolledCoursesOrIds: any[]) => {
        // If the backend now returns full course objects, just assign them.
        console.log('Enrolled courses response:', enrolledCoursesOrIds); 
        if (enrolledCoursesOrIds.length > 0 && enrolledCoursesOrIds[0]?.title) {
          return enrolledCoursesOrIds as Course[];
        }
        // Otherwise, treat as IDs and fetch all courses to filter.
        return enrolledCoursesOrIds;
      }),
      switchMap((enrolledCoursesOrIds: any[]) => {
        // If already have full course objects, skip filtering.
        if (enrolledCoursesOrIds.length > 0 && enrolledCoursesOrIds[0]?.title) {
          this.hasNoCourses = false;
          this.isLoading = false;
          return of(enrolledCoursesOrIds);
        }
        // If empty, handle as before.
        if (enrolledCoursesOrIds.length === 0) {
          this.hasNoCourses = true;
          this.isLoading = false;
          return of([]);
        }
        this.hasNoCourses = false;
        // Fetch all courses and filter to only those the user is enrolled in
        return this.courseService.getAllCourses().pipe(
          map(allCourses => {
            return allCourses.filter((course: { id: string; }) => enrolledCoursesOrIds.includes(course.id));
          })
        );
      }),
      catchError(err => {
        // Handles errors from the observable pipe.
        this.error = err.message || 'An unknown error occurred while fetching your courses.';
        this.isLoading = false;
        return of([]); // Return an empty array to prevent breaking the stream
      })
    ).subscribe({
      next: (filteredCourses) => {
        this.enrolledCourses = filteredCourses;
        this.isLoading = false;
        if (this.enrolledCourses.length === 0 && !this.error) {
            this.hasNoCourses = true;
        }
      }
      // Note: Error handling is now done inside the catchError operator
    });
  }

  /**
   * Starts the selected course.
   * This method can be expanded to navigate to a lesson player or course detail page.
   * @param course The course to start.
   */
  startCourse(course: Course): void {
    console.log('Starting course:', course.title);
    // Example navigation:
    // this.router.navigate(['/courses', course.id, 'player']);
  }
}
