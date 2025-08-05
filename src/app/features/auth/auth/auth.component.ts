import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BUTTONS, LABELS, ERROR_MESSAGES } from '../../../core/utils/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * AuthComponent manages the authentication UI and logic for login and registration.
 * It handles form validation, error display, and user feedback for both flows.
 */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public BUTTONS = BUTTONS;
  public LABELS = LABELS;
  public ERROR_MESSAGES = ERROR_MESSAGES;

  // Holds the login form data
  loginData = { email: '', password: '' };

  // Holds the registration form data
  registerData = { fullName: '', username: '', email: '', password: '', confirmPassword: '', terms: false };
  
  // Controls which form is shown (login or register)
  showRegister = false;

  // Stores error messages for login and registration
  loginError = '';
  registerError = '';
  
  // Controls password field visibility
  passwordFieldType: 'password' | 'text' = 'password';

  // Carousel images for the UI
  carouselImages = [
    { url: 'https://images.unsplash.com/photo-1688733720228-4f7a18681c4f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Student studying online' },
    { url: 'https://media.istockphoto.com/id/1081869356/photo/taking-on-the-late-shift-with-true-dedication.jpg?s=1024x1024&w=is&k=20&c=BHWRYftmZ0QjelJJECJ5BcIgwH6vqPF904IslEZExCo=', alt: 'Online lecture on laptop' },
    { url: 'https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];
  currentImageIndex = 0;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Initializes the component and starts the image carousel.
   */
  ngOnInit(): void {
    if (this.carouselImages.length > 0) {
      setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
      }, 2000);
    }
  }

  /**
   * Handles the login form submission.
   * Validates input, calls the AuthService, and navigates to the dashboard on success.
   */
  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
        this.loginError = "Email and password are required.";
        return;
    }
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.loginError = '';
        // Show a snackbar notification on successful login
      this._snackBar.open('Login successful!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
        // Redirect to dashboard after successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = err.error.error || this.ERROR_MESSAGES.LOGIN_FAILED;
      }
    });
  }

  /**
   * Handles the registration form submission.
   * Validates input, calls the AuthService, and provides feedback to the user.
   */
  onRegister(): void {
    if (
      !this.registerData.fullName ||
      !this.registerData.username ||
      !this.registerData.password ||
      !this.registerData.email ||
      !this.registerData.confirmPassword ||
      !this.registerData.terms
    ) {
      this.registerError = this.ERROR_MESSAGES.REQUIRED_FIELDS;
      return;
    }
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.registerError = this.ERROR_MESSAGES.PASSWORD_MISMATCH;
      return;
    }

    this.authService.register(
      this.registerData.username,
      this.registerData.password,
      this.registerData.email
    ).subscribe({
      next: (response) => {
        // Show a snackbar notification on successful registration
        this._snackBar.open('Registered successfully, please login', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        
        this.registerError = '';
        this.showRegister = false;
        // Reset registration form fields
        this.registerData = { fullName: '', username: '', email: '', password: '', confirmPassword: '', terms: false };
      },
      error: (error) => {
        this.registerError = error.error.error || this.ERROR_MESSAGES.USER_EXISTS;
      }
    });
  }

  /**
   * Toggles between the login and registration forms.
   * Also resets error messages and sensitive form fields.
   */
  toggleForm(): void {
    this.showRegister = !this.showRegister;
    this.loginError = '';
    this.registerError = '';
    this.loginData = { email: '', password: '' };
    this.registerData.password = '';
    this.registerData.confirmPassword = '';
  }


}