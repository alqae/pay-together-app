export type CreateDebtRequest = {
  amount: number;
  description: string;
  dueDate: Date;
};

export type UpdateDebtRequest = {
  amount?: number;
  description?: string;
  dueDate?: Date;
};
