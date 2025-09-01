import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { LoginResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null); // Refresh token
  private userSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public token$ = this.tokenSubject.asObservable();
  public refreshToken$ = this.refreshTokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/register', { email, password, fullName })
      .pipe(
        tap(response => {
          this.setSession(response.accessToken, response.refreshToken, response.user);
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(
        tap(response => {
          this.setSession(response.accessToken, response.refreshToken, response.user);
        })
      );
  }

  refreshToken(): Observable<{token: string}> {
    const refreshToken = this.getCurrentRefreshToken();

    return this.http.post<{token: string}>('/api/auth/refresh', null, {
      headers: {
        'Refresh-Token': refreshToken as string
      }
    });
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
  }

  private clearSession(): void {
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
}
