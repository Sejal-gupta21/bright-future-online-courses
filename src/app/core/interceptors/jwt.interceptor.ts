
//automatically attaches a JWT token to every outgoing HTTP request if the token exists in localStorage
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    /**
     * This method intercepts every outgoing HTTP request.
     * If a JWT token is present in localStorage, it adds it to the Authorization header.
     * This ensures that protected backend endpoints receive the user's token for authentication.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Retrieve the JWT token from localStorage
        const JWT_TOKEN = localStorage.getItem('token');

        // If a token exists, clone the request and add the Authorization header
        if (JWT_TOKEN) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${JWT_TOKEN}` },
            });
        }

        // Pass the request to the next handler in the chain
        return next.handle(request);
    }
}