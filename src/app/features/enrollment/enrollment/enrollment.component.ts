import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BUTTONS, LABELS } from '../../../core/utils/constants';
import { AuthService } from '../../../core/services/auth.service';
import {take} from 'rxjs/operators'; //Ensures that only one emission is received 
/**
 * EnrollmentComponent handles the course enrollment form.
 * It validates user input, manages form state, and navigates to the payment page upon successful submission.
 */
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentComponent implements OnInit {
  readonly BUTTONS = BUTTONS;
  readonly LABELS = LABELS;
  enrollmentForm!: FormGroup;
  readonly priorExperienceOptions: readonly string[] = [
    'None', 'Beginner', 'Intermediate', 'Advanced',
  ];
  selectedCourseId: string | null = null;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * OnInit lifecycle hook.
   * Retrieves the selected course ID from the route and initializes the form.
   * If no course is selected, redirects the user back to the dashboard.
   */
  ngOnInit(): void {
    this.selectedCourseId = this.route.snapshot.queryParamMap.get('course');
    if (!this.selectedCourseId) {
      this.snackBar.open('No course selected for enrollment.', 'Dismiss', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    }
    this.initForm();

        // Fetch user data and patch the form for name and email
    this.authService.refreshCurrentUser().pipe(take(1)).subscribe({
      next: (user) => {
        this.enrollmentForm.patchValue({
          fullName: user.name || '',
          email: user.email || ''
        });
      }
    });
  }

  

  /**
   * Initializes the enrollment form with validation rules for each field.
   */
  private initForm(): void {
    this.enrollmentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{2,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      photo: [null],
      priorExperience: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });
  }
  
  /**
   * Checks if a form control is invalid and has been interacted with.
   * @param controlName The name of the control to check.
   * @returns True if the control is invalid and touched or dirty.
   */
  isInvalid(controlName: string): boolean {
    const control = this.enrollmentForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
  
  /**
   * Marks a form control as touched to trigger validation feedback.
   * @param controlName The name of the control to mark as touched.
   */
  markTouched(controlName: string): void {
    this.enrollmentForm.get(controlName)?.markAsTouched();
  }

  /**
   * Handles form submission.
   * If the form is valid, navigates to the payment page and passes the form data and course ID.
   * If invalid, shows an error message.
   */
onSubmit(): void {
  this.enrollmentForm.markAllAsTouched();

  if (this.enrollmentForm.invalid) {
    this.snackBar.open('Please correct the form errors before proceeding.', 'Dismiss', { 
      duration: 3000, 
      panelClass: ['snackbar-error'] 
    });
    return;
  }

  this.isSubmitting = true;
  this.snackBar.open('Form submitted successfully! Redirecting to payment...', 'OK', { 
    duration: 2000, 
    panelClass: ['snackbar-success'] 
  });

  // Only enroll after successful form validation and submission
  this.authService.enrollCourse(this.selectedCourseId!).subscribe({
    next: () => {
      // Pass the enrollment form data and course ID to the payment component using router state.
      const paymentNavigationExtras: NavigationExtras = {
        state: {
          enrollmentData: this.enrollmentForm.value,
          courseId: this.selectedCourseId,
        },
      };
      this.router.navigate(['/payment'], paymentNavigationExtras);
    },
    error: (err) => {
      this.isSubmitting = false;
      if (err.status === 409) {
        this.snackBar.open('You are already enrolled in this course.', 'Dismiss', { duration: 3000, panelClass: ['snackbar-error'] });
        // Optionally, redirect to my-courses or stay on the form
        // this.router.navigate(['/courses/my-courses']);
      } else {
        this.snackBar.open('Enrollment failed. Please try again.', 'Dismiss', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    }
  });
}

  /**
   * Handles file input changes for the photo upload field.
   * Updates the form control with the selected file.
   * @param event The file input change event.
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.enrollmentForm.get('photo')?.setValue(file);
    } else {
      this.enrollmentForm.get('photo')?.setValue(null);
    }
  }
  
  /**
   * Navigates back to the previous page in the browser history.
   */
  goBack(): void {
    window.history.back();
  }
}