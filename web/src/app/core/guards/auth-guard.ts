import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Auth } from '@core/services/auth';

type AuthGuardTypeReturn = boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): AuthGuardTypeReturn {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
