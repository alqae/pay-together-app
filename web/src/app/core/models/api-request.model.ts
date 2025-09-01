export type CreateDebtRequest = {
  amount: number;
  description: string;
  dueDate: string;
};

export type UpdateDebtRequest = {
  amount?: number;
  description?: string;
  dueDate?: string;
};
