import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Course } from '../../../core/models/course.model';
import { BUTTONS } from '../../../core/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';

/**
 * DashboardComponent displays the list of available courses to the user.
 * It handles loading state, error handling, and navigation to course details or enrollment.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  readonly BUTTONS = BUTTONS;
  courses: Course[] = [];
  isLoading = true;
  error: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef, //A service you can inject to manually control when and how change detection runs on a component or its children.
    private route: ActivatedRoute
  ) {}

  /**
   * Lifecycle hook that runs after component initialization.
   * Initiates fetching of all courses to display on the dashboard.
   */
  ngOnInit(): void {
    this.fetchCourses();
  }

  /**
   * Fetches all courses from the backend using the CourseService.
   * Handles loading and error states, and updates the view accordingly.
   */
  private fetchCourses(): void {
    this.isLoading = true;
    this.error = "";
    this.courseService.getAllCourses().subscribe({
      next: (coursesData) => {
        // Assigns the fetched courses to the local array for display.
        this.courses = coursesData || [];
        this.isLoading = false;
        this.cdr.markForCheck(); // Ensures the view updates after data changes.
      },
      error: (err) => {
        // Handles errors by displaying a message and updating the error state.
        this.error = err.message || 'Failed to load courses.';
        this.isLoading = false;
        this.cdr.markForCheck();
        this.snackBar.open(this.error, 'Dismiss', { duration: 5000 });
      }
    });
  }

  /**
   * Navigates to the course details page for the selected course.
   * @param courseId The ID of the course to view details for.
   */
  goToDetails(courseId: string | null): void {
    if (!courseId) return;
    this.router.navigate(['details', courseId]);
  }

  /**
   * Navigates to the enrollment page for the selected course.
   * Also displays a snackbar notification to the user.
   * @param courseId The ID of the course to enroll in.
   */
enrollCourse(courseId: string) {
  // Only navigate to the enrollment form, do NOT call enrollCourse here!
  this.router.navigate(['/enroll'], { queryParams: { course: courseId } });
}
}