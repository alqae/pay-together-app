import { User } from './user.model';

export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;

  constructor(accessToken: string, refreshToken: string, user: User) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}

export class DebtCountersResponse {
  pendingBalance: number;
  paidDebts: number;

  constructor(pendingBalance: number, paidDebts: number) {
    this.pendingBalance = pendingBalance;
    this.paidDebts = paidDebts;
  }
}
