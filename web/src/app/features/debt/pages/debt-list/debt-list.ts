import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DebtService } from '@core/services/debt-service';
import { Debt } from '@core/models/debt.model';
import { DebtCountersResponse } from '@core/models/api-response.model';

@Component({
  selector: 'app-debt-list',
  standalone: false,
  templateUrl: './debt-list.html',
  styleUrl: './debt-list.css'
})
export class DebtList implements OnInit  {
  @ViewChild('debtsList') debtsList!: ElementRef;

  public error: string | undefined;

  public skip: number = 0;
  public take: number = 10;
  public total: number = 0;

  public search = '';
  public paid?: string;

  public debts: Debt[] = [];

  public counter: DebtCountersResponse = {
    pendingBalance: 0,
    paidDebts: 0,
  };
  public isLoading$: Observable<boolean>;

  constructor(private readonly debtService: DebtService) {
    this.isLoading$ = this.debtService.isLoading$;
  }

  ngOnInit() {
    this.fetchDebts();
  }

  exportToCsv() {
    this.debtService.exportToCsv(this.search, this.paid);
  }

  onSearchChange(event: Event) {
    // TODO: debounce
    this.search = (event.target as HTMLInputElement).value;
    this.resetPagination();
    this.fetchDebts();
  }

  onStatusChange(event: Event) {
    this.paid = (event.target as HTMLSelectElement).value;
    this.resetPagination();
    this.fetchDebts();
  }

  resetPagination() {
    this.skip = 0;
    this.take = 10;
    this.total = 0;
  }

  currentPage(): number {
    return this.skip / this.take + 1;
  }

  canNextPage(): boolean {
    return this.skip + this.take < this.total;
  }

  canPreviousPage(): boolean {
    return this.skip > 0;
  }

  nextPage() {
    if (this.skip + this.take >= this.total) return;
    this.skip += this.take;
    this.scrollToTop();
    setTimeout(() => this.fetchDebts(), 250);
  }

  previousPage() {
    if (this.skip <= 0) return;
    this.skip -= this.take;
    this.scrollToTop();
    setTimeout(() => this.fetchDebts(), 250);
  }

  fetchDebts() {
    this.debtService.getDebts(this.skip, this.take, this.search, this.paid).subscribe({
      next: (result) => {
        this.debts = result.debts;
        this.total = result.total;
      },
      error: (error) => {
        this.error = error;
      }
    });

    this.fetchCounter();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  fetchCounter() {
    this.debtService.getCounters().subscribe({
      next: (result) => {
        this.counter = result;
      },
      error: (error) => {
        this.counter = {
          pendingBalance: 0,
          paidDebts: 0,
        };
      }
    });
  }
}
