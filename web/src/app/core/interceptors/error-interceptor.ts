import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';

import { NotificationService } from '@core/services/notification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private API_URL = 'http://localhost:3000/';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private injector: Injector,
    private http: HttpClient,
    private router: Router,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.message) {
          const notificationService = this.injector.get(NotificationService);
          notificationService.showError(error.error.message);
        }

        const isAuthenticated = window.localStorage.getItem("accessToken") !== null;
        if (error.status === 401 && isAuthenticated && !this.isRefreshing) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = window.localStorage.getItem("refreshToken");
      return this.http.post<{ token: string }>(`${this.API_URL}auth/refresh`, null, {
        headers: {
          'Refresh-Token': refreshToken as string
        }
      }).pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.token);
          const newRequest = this.addToken(request, response.token);
          return next.handle(newRequest);
        }),
        catchError((refreshError) => {
          this.isRefreshing = false;
          const notificationService = this.injector.get(NotificationService);
          notificationService.showError('Sorry, your session has expired');
          // this.injector.get(Auth).logout();
          this.router.navigate(['/auth/login']);
          window.localStorage.removeItem("refreshToken");
          window.localStorage.removeItem("accessToken");
          return throwError(() => refreshError);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          const newRequest = this.addToken(request, token);
          return next.handle(newRequest);
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
