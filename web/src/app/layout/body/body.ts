import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt';
import { Auth } from '@core/services/auth';

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

  constructor(private readonly auth: Auth, private readonly debtService: DebtService) {
    this.isAuthenticated$ = this.auth.isLoggedIn$;
    this.isLoadingAuth$ = this.auth.isLoading$;
    this.isLoadingDebt$ = this.debtService.isLoading$;
  }
}
