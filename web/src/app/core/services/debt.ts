import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CreateDebtRequest, UpdateDebtRequest } from '../models/api-request.model';
import { DebtCountersResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class Debt {
  constructor(private http: HttpClient) {}

  createDebt(body: CreateDebtRequest) {
    return this.http.post("/api/debts", body);
  }

  getDebts(
    skip: number,
    take: number,
    description?: string,
    paid?: boolean,
  ) {
    let params = new HttpParams().set("skip", skip).set("take", take);

    if (description) {
      params = params.set("description", description)
    }

    if (paid) {
      params = params.set("paid", paid.toString())
    }

    return this.http.get("/api/debts", {
      params,
    });
  }

  getDebtById(id: number) {
    return this.http.get("/api/debts/" + id);
  }

  updateDebt(id: number, body: UpdateDebtRequest) {
    return this.http.put("/api/debts/" + id, body);
  }

  deleteDebt(id: number) {
    return this.http.delete("/api/debts/" + id);
  }

  togglePaid(id: number) {
    return this.http.patch(`/api/debts/${id}/paid`, {});
  }

  getCounters() {
    return this.http.get<DebtCountersResponse>("/api/debts/counters");
  }

  exportToCsv(description?: string, paid?: boolean) {
    let params = new HttpParams()

    if (description) {
      params = params.set("description", description)
    }

    if (paid) {
      params = params.set("paid", paid.toString())
    }

    return this.http.get("/api/debts/export", { params, responseType: "blob" })
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
