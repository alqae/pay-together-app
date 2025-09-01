import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '@core/services/notification-service';
import { LoginResponse } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null); // Refresh token
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  public token$ = this.tokenSubject.asObservable();
  public refreshToken$ = this.refreshTokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  private API_URL = 'http://localhost:3000/';

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient,
    private router: Router,
  ) {
    const token = window.localStorage.getItem("accessToken");
    const refreshToken = window.localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      this.tokenSubject.next(token);
      this.refreshTokenSubject.next(refreshToken);
      this.isLoggedInSubject.next(true);
      this.fetchUser().subscribe();
    }
  }

  register(email: string, password: string, fullName: string): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}auth/register`, { email, password, fullName })
      .pipe(
        tap(response => this.setSession(response.accessToken, response.refreshToken, response.user)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}auth/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response.accessToken, response.refreshToken, response.user)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  refreshToken(): Observable<{token: string}> {
    this.isLoadingSubject.next(true);
    const refreshToken = this.getCurrentRefreshToken();

    return this.http.post<{token: string}>(`${this.API_URL}auth/refresh`, null, {
      headers: {
        'Refresh-Token': refreshToken as string
      }
    }).pipe(
      tap(() => this.isLoadingSubject.next(false)),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  fetchUser(): Observable<User> {
    this.isLoadingSubject.next(true);
    return this.http.get<User>(`${this.API_URL}auth/whoami`)
      .pipe(
        tap(user => this.userSubject.next(user)),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  logout(): void {
    this.clearSession();
  }

  getCurrentToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  private setSession(token: string, refreshToken: string, user: User): void {
    this.tokenSubject.next(token);
    this.refreshTokenSubject.next(refreshToken);
    this.userSubject.next(user);
    this.isLoggedInSubject.next(true);

    this.router.navigate(['/debts']);
    this.notificationService.showSuccess('Welcome back!');

    window.localStorage.setItem("refreshToken", refreshToken);
    window.localStorage.setItem("accessToken", token);
  }

  private clearSession(): void {
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);

    this.router.navigate(['/auth/login']);
    this.notificationService.showSuccess('You have been logged out!');

    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("accessToken");
  }
}
