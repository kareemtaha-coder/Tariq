import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  expiresin: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  http =inject(HttpClient)
  private tokenExpirationTimer: any;
  private apiUrl = 'https://localhost:7181/api/Auth'; // Should be in environment file
  isUserLoggedIn=signal<boolean>(false)
  constructor(

    private router: Router
  ) {
    // Check if user info exists in local storage on service initialization
    this.loadStoredUserInfo();
  }

  // Get current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Load user info from localStorage if it exists
  private loadStoredUserInfo(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expires_at');

    if (user && token && expiresAt) {
      const parsedUser = JSON.parse(user) as User;
      this.currentUserSubject.next(parsedUser);

      // Check if token is expired
      const now = new Date().getTime();
      const expiresInMs = new Date(expiresAt).getTime() - now;

      if (expiresInMs > 0) {
        // Set auto logout timer
        this.autoLogout(expiresInMs);
      } else {
        // Token expired, logout
        this.logout();
      }
    }
  }

  // Login method
  login(credentials: LoginRequest): Observable<LoginResponse> {
    
    return this.http.post<LoginResponse>(this.apiUrl, credentials)
      .pipe(
        tap(response => this.handleLoginSuccess(response)),
      );

  }

  // Handle successful login
  private handleLoginSuccess(response: LoginResponse): void {
    // Calculate token expiration date
    const expiresAt = new Date(new Date().getTime() + response.expiresin * 1000);

    // Create user object
    const user: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      fullName: `${response.firstName} ${response.lastName}`
    };

    // Save to localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expires_at', expiresAt.toISOString());

    // Update subject
    this.currentUserSubject.next(user);

    // Set auto logout timer
    this.autoLogout(response.expiresin * 1000);
  }

  // Logout method
  logout(): void {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expires_at');
    this.isUserLoggedIn.set(false)
    // Clear timeout
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    // Update subject
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  // Auto logout after token expires
  private autoLogout(expiresInMs: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresInMs);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expires_at');

    if (!token || !expiresAt) {
      return false;
    }

    return new Date() < new Date(expiresAt);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
