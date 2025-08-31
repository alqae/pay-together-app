import { Debt } from 'generated/prisma';

export const exampleDebt = {
  id: 0,
  amount: 0,
  description: 'Description of the debt',
  dueDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  paid: false,
  userId: 0,
} as Debt;
