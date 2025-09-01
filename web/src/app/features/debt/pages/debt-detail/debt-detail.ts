import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt-service';
import { Debt } from '@core/models/debt.model';

@Component({
  selector: 'app-debt-detail',
  standalone: false,
  templateUrl: './debt-detail.html',
  styleUrl: './debt-detail.css'
})
export class DebtDetail {
  public isLoading$: Observable<boolean>;
  public debtId: number | undefined;
  public debt: Debt | undefined;

  constructor(
    private debtService: DebtService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.debtService.isLoading$;
    if (this.route.snapshot.paramMap.has('id')) {
      this.debtId = parseInt(this.route.snapshot.paramMap.get('id')!);
    }
  }

  ngOnInit() {
    this.debtService.getDebtById(this.debtId!)
      .subscribe({ next: (debt) => this.debt = debt });
  }

  onDelete() {
    this.debtService.deleteDebt(this.debt!.id)
      .subscribe({ next: () => this.router.navigate(['/debts']) });
  }

  onTogglePaid() {
    this.debtService.togglePaid(this.debt!.id)
      .subscribe({ next: (debt) => this.debt = debt });
  }

  onEdit(debt: Debt) {
    this.router.navigate(['/debts', debt.id, 'edit'], {
      state: { debt }
    });
  }
}
