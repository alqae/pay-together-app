import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt';
import { Debt } from '@core/models/debt.model';

@Component({
  selector: 'app-debt-edit',
  standalone: false,
  templateUrl: './debt-edit.html',
  styleUrl: './debt-edit.css'
})
export class DebtEdit implements OnInit {

  isLoading$: Observable<boolean>;
  debtId: number | undefined;
  debt: Debt | undefined;

  constructor(
    private route: ActivatedRoute,
    private debtService: DebtService,
    private router: Router
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

  onSubmit(event: Omit<Debt, 'id' | 'createdAt' | 'updatedAt' | 'paid'>) {
    this.debtService.updateDebt(this.debtId!, event)
      .subscribe({ next: () => this.router.navigate(['/debts', this.debtId]) });
  }
}
