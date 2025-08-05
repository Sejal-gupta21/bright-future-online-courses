//Keeps the code DRY (Don’t Repeat Yourself) by avoiding repetitive error handling logic.
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * This method is called for every outgoing HTTP request.
   * It allows us to handle errors globally, so we don't have to repeat error handling in every service or component.
   * If an HTTP error occurs, we show a user-friendly message using Angular Material's snackbar.
   * The error is then re-thrown so that any component making the request can still handle it if needed.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unknown error occurred!';
        let status = error.status;

        // If the backend provides a specific error message, use it.
        if (error.error && typeof error.error === 'object' && error.error.error) {
          message = error.error.error;
        } else if (error.error && typeof error.error === 'string') {
          message = error.error;
        } else if (error.message) {
          message = error.message;
        }

        // Format the message to include the HTTP status code if available.
        const displayMsg = status
          ? `Error ${status}: ${message}`
          : message;

        // Show the error message at the bottom of the screen.
        this.snackBar.open(displayMsg, 'Dismiss', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });

        // Pass the error along so that other error handlers can act on it if needed.
        return throwError(() => error);
      })
    );
  }
}