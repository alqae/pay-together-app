export class Debt {
  id: number
  amount: number
  description: string
  paid: boolean
  createdAt: string
  updatedAt: string
  dueDate: string
  userId: number

  constructor(
    id: number,
    amount: number,
    description: string,
    paid: boolean,
    createdAt: string,
    updatedAt: string,
    dueDate: string,
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
