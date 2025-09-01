# Pay Together API

## Description

This project is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository

## Requirements

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Redis](https://redis.io/download), [PostgreSQL](https://www.postgresql.org/download/) or [Docker](https://www.docker.com/products/docker-desktop)

## Project setup

```bash
$ yarn install
```

## Environment variables

Copy the `.env.example` file to `.env` and fill in the values.

## Prisma

```bash
# Generate Prisma client
$ yarn run prisma generate

# Migrate database
$ yarn run prisma migrate dev
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
## 📖 API Documentation

Interactive API docs are available at:

```
http://localhost:3000/api
```

Powered by Swagger/OpenAPI.

---

## 📁 Project Structure

```
server/
├── src/
├───── auth/          # Auth module
├───── debts/         # Debts module
├───── entities/      # TypeORM entity definitions
├───── users/         # Users module
├───── tests/         # Tests
├───── main.ts        # App entry point
├── config/          # Configuration files
├── prisma/          # Prisma client configuration
└── package.json     # Package.json
```
