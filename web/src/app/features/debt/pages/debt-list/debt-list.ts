import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DebtService } from '@core/services/debt';
import { Debt } from '@core/models/debt.model';

@Component({
  selector: 'app-debt-list',
  standalone: false,
  templateUrl: './debt-list.html',
  styleUrl: './debt-list.css'
})
export class DebtList {
  public error: string | undefined;

  public skip: number = 0;
  public take: number = 10;
  public total: number = 0;

  public search = '';
  public paid = false;

  public debts: Debt[] = [
    new Debt(
      1,
      199,
      'Debt 1',
      false,
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      1
    ),
    new Debt(
      2,
      199,
      'Debt 2',
      true,
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      1
    ),
    new Debt(
      3,
      199,
      'Debt 3',
      false,
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      '2025-08-31T18:24:25.861Z',
      1
    ),
  ];

  // public debts$: Observable<Debt[]>;
  public isLoading$: Observable<boolean>;

  constructor(private readonly debtService: DebtService) {
    this.isLoading$ = this.debtService.isLoading$;
  }

  exportToCsv() {
    this.debtService.exportToCsv(this.search, this.paid);
  }

  onSearchChange(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.resetPagination();
    // TODO refresh debts
  }

  onStatusChange(event: Event) {
    this.paid = (event.target as HTMLSelectElement).value === 'true';
    this.resetPagination();
    // TODO refresh debts
  }

  resetPagination() {
    this.skip = 0;
    this.take = 10;
    this.total = 0;
  }
}
