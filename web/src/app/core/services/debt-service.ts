import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DebtCountersResponse, PaginatedResponse } from '@core/models/api-response.model';
import { CreateDebtRequest, UpdateDebtRequest } from '@core/models/api-request.model';
import { Debt } from '@core/models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private readonly API_URL = "http://localhost:3000/";

  constructor(private http: HttpClient) {}

  createDebt(body: CreateDebtRequest) {
    this.isLoadingSubject.next(true);
    return this.http.post(`${this.API_URL}debts`, body)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  getDebts(
    skip: number,
    take: number,
    description?: string,
    paid?: string,
  ) {
    let params = new HttpParams().set("skip", skip).set("take", take);

    if (description) {
      params = params.set("description", description)
    }

    if (paid !== undefined && paid !== "") {
      params = params.set("paid", paid)
    }

    this.isLoadingSubject.next(true);
    return this.http.get<PaginatedResponse<Debt>>(`${this.API_URL}debts`, { params })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  getDebtById(id: number) {
    this.isLoadingSubject.next(true);
    return this.http.get<Debt>(`${this.API_URL}debts/` + id)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateDebt(id: number, body: UpdateDebtRequest) {
    this.isLoadingSubject.next(true);
    return this.http.patch<Debt>(`${this.API_URL}debts/` + id, body)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteDebt(id: number) {
    this.isLoadingSubject.next(true);
    return this.http.delete(`${this.API_URL}debts/` + id)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  togglePaid(id: number) {
    this.isLoadingSubject.next(true);
    return this.http.patch<Debt>(`${this.API_URL}debts/${id}/toggle-paid`, {})
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  getCounters() {
    this.isLoadingSubject.next(true);
    return this.http.get<DebtCountersResponse>(`${this.API_URL}debts/counters`)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  exportToCsv(description?: string, paid?: string) {
    let params = new HttpParams()

    if (description) {
      params = params.set("description", description)
    }

    if (paid != undefined && paid !== "") {
      params = params.set("paid", paid)
    }

    this.isLoadingSubject.next(true);
    return this.http.get(`${this.API_URL}debts/export`, { params, responseType: "blob" })
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe(this.downloadBlob);
  }

  private downloadBlob(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "debts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
