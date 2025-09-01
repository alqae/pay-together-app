export class Debt {
  id: number
  amount: number
  description: string | null
  paid: boolean
  createdAt: Date
  updatedAt: Date
  dueDate: Date
  userId: number

  constructor(
    id: number,
    amount: number,
    description: string | null,
    paid: boolean,
    createdAt: Date,
    updatedAt: Date,
    dueDate: Date,
    userId: number,
  ) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.paid = paid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.userId = userId;
  }
}
