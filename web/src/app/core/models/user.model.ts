export class User {
  id: number
  email: string
  fullName: string
  password: string
  tokenVersion: number
  createdAt: Date
  updatedAt: Date

  constructor(
    id: number,
    email: string,
    fullName: string,
    password: string,
    tokenVersion: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.password = password;
    this.tokenVersion = tokenVersion;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
