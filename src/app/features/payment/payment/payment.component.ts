import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * PaymentComponent handles the Google Pay checkout process.
 * It manages payment state, processes the payment, and enrolls the user in the selected course.
 */
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentRequest: google.payments.api.PaymentDataRequest;
  isProcessing = false;          // Indicates if payment is being processed
  paymentSuccessful = false;     // Indicates if payment was successful
  courseId: string = '';         // The ID of the course to enroll in
  enrollError: string | null = null; // Stores any enrollment error message
  enrolling = false;             // Indicates if enrollment is in progress

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the Google Pay payment request (price and course name can be dynamic)
    this.paymentRequest = this.paymentService.getPaymentDataRequest('99.99', 'Selected Course');
  }

  /**
   * OnInit lifecycle hook.
   * Retrieves the courseId from query parameters.
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'];
    });
  }

  /**
   * Called when Google Pay returns payment data.
   * Simulates payment processing and sets paymentSuccessful to true.
   * @param event The payment data event.
   */
  onLoadPaymentData(event: Event): void {
    this.isProcessing = true;
    // Simulate payment processing delay
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccessful = true;
    }, 2000);
  }

  /**
   * Handles payment errors from Google Pay.
   * @param event The error event.
   */
  onError(event: any): void {
    console.error('Payment Error:', event);
    this.isProcessing = false;
  }

  /**
   * Navigates the user to the "My Courses" page after enrolling.
   * If enrollment fails, displays an error message.
   */
  goToMyCourses(): void {
    if (this.courseId) {
      this.enrolling = true;
      this.enrollError = null;
      this.authService.enrollCourse(this.courseId).subscribe({
        next: () => {
          this.enrolling = false;
          this.router.navigate(['/my-courses']);
        },
        error: (err) => {
          this.enrolling = false;
          this.enrollError = 'Failed to enroll in course. Please try again.';
        }
      });
    } else {
      this.router.navigate(['/my-courses']);
    }
  }
}