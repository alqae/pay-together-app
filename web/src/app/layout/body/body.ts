import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './body.html',
  styleUrl: './body.css'
})
export class Body {
  isAuthenticated$: Observable<boolean>;
  isLoadingAuth$: Observable<boolean>;
  isLoadingDebt$: Observable<boolean>;

  constructor(private readonly authService: AuthService, private readonly debtService: DebtService) {
    this.isAuthenticated$ = this.authService.isLoggedIn$;
    this.isLoadingAuth$ = this.authService.isLoading$;
    this.isLoadingDebt$ = this.debtService.isLoading$;
  }
}
