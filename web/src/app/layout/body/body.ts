import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Auth } from '@core/services/auth';
import { Debt } from '@core/services/debt';

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

  constructor(private readonly auth: Auth, private readonly debt: Debt) {
    this.isAuthenticated$ = this.auth.isLoggedIn$;
    this.isLoadingAuth$ = this.auth.isLoading$;
    this.isLoadingDebt$ = this.debt.isLoading$;
  }
}
