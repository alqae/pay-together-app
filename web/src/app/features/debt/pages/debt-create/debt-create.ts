import { Component } from '@angular/core';

import { DebtService } from '@core/services/debt-service';
import { Debt } from '@core/models/debt.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debt-create',
  standalone: false,
  templateUrl: './debt-create.html',
  styleUrl: './debt-create.css'
})
export class DebtCreate {
  constructor(private debtsService: DebtService, private router: Router) {}

  onSubmit(event: Omit<Debt, 'id' | 'createdAt' | 'updatedAt' | 'paid'>) {
    this.debtsService.createDebt({
      description: event.description,
      amount: event.amount,
      dueDate: event.dueDate,
    }).subscribe({ next: () => this.router.navigate(['/debts']) });
  }
}
