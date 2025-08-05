import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * NavbarComponent displays the top navigation bar with profile menu.
 * Handles navigation, menu toggling, and user logout.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  menuOpen = false; // Controls the visibility of the profile dropdown menu

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Navigates to the "My Courses" page and closes the profile menu.
   */
  goToMyCourses(): void {
    this.menuOpen = false;
    this.router.navigate(['/my-courses']);
  }

  /**
   * Navigates to the dashboard page.
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Toggles the profile dropdown menu open/closed.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Logs out the user, closes the menu, and navigates to the auth page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
    this.menuOpen = false;
  }
}