import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * AuthGuard protects routes from unauthorized access.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // User is logged in, allow access.
    }

    // User is not logged in, show message and redirect.
    this.snackBar.open('Please login to access this page.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'] // Optional class for custom styling
    });

    this.router.navigate(['/auth']);
    return false; // Block access to the route.
  }
}
