import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * DetailsComponent displays detailed information about a single course.
 * It handles fetching the course data, loading state, error handling, and user actions like "Buy Now" and "Add to Cart".
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  course: Course | null = null;
  isLoading = true;
  error: string  = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) { }

  /**
   * OnInit lifecycle hook.
   * Extracts the course ID from the route and fetches course details.
   * If the ID is missing, shows an error and stops loading.
   */
  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(courseId);
    } else {
      this.error = "Course ID is missing from the URL.";
      this.isLoading = false;
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    }
  }

  /**
   * Fetches course details from the backend using the CourseService.
   * Handles loading and error states, and updates the view accordingly.
   * @param id The ID of the course to fetch.
   */
  fetchCourseDetails(id: string): void {
    this.isLoading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (courseData) => {
        this.course = courseData || null;
        if (!this.course) {
          this.error = `Course with ID '${id}' not found.`;
          this.snackBar.open(this.error, 'Close', { duration: 5000 });
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  /**
   * Navigates the user to the enrollment page for the current course.
   * Passes the course ID as a query parameter.
   */
  buyNow(): void {
    if (!this.course) return;
    this.router.navigate(['/enroll'], { queryParams: { course: this.course.id } });
  }

  /**
   * Handles the "Add to Cart" action.
   * Currently, it just shows a snackbar notification and logs to the console.
   * (You can integrate with a cart service here in the future.)
   */
  addToCart(): void {
    if (!this.course) return;
    console.log('Adding to cart:', this.course.title);
    this.snackBar.open(`${this.course.title} has been added to your cart.`, 'Close', {
      duration: 3000
    });
    // this.cartService.addItem(this.course);
  }
}