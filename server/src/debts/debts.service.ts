import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Response } from 'express';
import { format } from 'fast-csv';

import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

type DebtCounters = {
  pendingBalance: number;
  paidDebts: number;
};

type PaginatedDebts = {
  total: number;
  debts: Debt[];
};

@Injectable()
export class DebtsService {
  private readonly PAGINATED_CACHE_TTL = 5000;
  private readonly UNPAGINATED_CACHE_TTL = 5000;
  private readonly COUNTERS_CACHE_TTL = 5000;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDebtDto: CreateDebtDto, userId: User['id']) {
    const debt = await this.prisma.debt.create({
      data: {
        amount: createDebtDto.amount,
        description: createDebtDto.description,
        dueDate: createDebtDto.dueDate,
        userId: userId,
      },
    });

    await this.invalidateCache(userId);
    return debt;
  }

  async getDebsPaginated(
    userId: User['id'],
    skip: number,
    take: number,
    description?: string,
    paid?: boolean,
  ): Promise<PaginatedDebts> {
    const hasFilters = description !== undefined || paid !== undefined;
    const key = this.debtsPaginatedKey(userId, skip, take);

    if (!hasFilters) {
      const cached = await this.cacheManager.get<PaginatedDebts>(key);
      if (cached) return cached;
    }

    const query: Prisma.DebtWhereInput = { userId };

    if (description) {
      query.description = {
        contains: description,
      };
    }

    if (paid !== undefined) {
      query.paid = {
        equals: paid,
      };
    }

    const debts = await this.prisma.debt.findMany({
      where: query,
      skip,
      take,
    });

    const total = await this.prisma.debt.count({ where: query });
    const result = { total, debts };

    if (!hasFilters) {
      await this.cacheManager.set(key, result, this.PAGINATED_CACHE_TTL);
    }

    return result;
  }

  async getDebsUnpaginated(
    userId: User['id'],
    description?: string,
    paid?: boolean,
  ): Promise<Debt[]> {
    const hasFilters = description !== undefined || paid !== undefined;
    const key = this.debtsUnpaginatedKey(userId);

    if (!hasFilters) {
      const cached = await this.cacheManager.get<Debt[]>(key);
      if (cached) return cached;
    }

    const query: Prisma.DebtWhereInput = { userId };

    if (description) {
      query.description = {
        contains: description,
      };
    }

    if (paid !== undefined) {
      query.paid = {
        equals: paid,
      };
    }

    const debts = await this.prisma.debt.findMany({ where: query });

    if (!hasFilters) {
      await this.cacheManager.set(key, debts, this.UNPAGINATED_CACHE_TTL);
    }

    return debts;
  }

  findOne(id: number): Promise<Debt | null> {
    return this.prisma.debt.findUnique({ where: { id } });
  }

  async update(id: number, updateDebtDto: UpdateDebtDto) {
    const data: Prisma.DebtUpdateInput = {};

    if (updateDebtDto.amount) {
      data.amount = updateDebtDto.amount;
    }

    if (updateDebtDto.description) {
      data.description = updateDebtDto.description;
    }

    if (updateDebtDto.dueDate) {
      data.dueDate = updateDebtDto.dueDate;
    }

    const debt = await this.prisma.debt.update({
      where: { id },
      data,
    });

    await this.invalidateCache(debt.userId);
    return debt;
  }

  async setPaid(id: number, paid: boolean) {
    const debt = await this.prisma.debt.update({
      where: { id },
      data: { paid },
    });
    await this.invalidateCache(debt.userId);
    return debt;
  }

  async remove(id: number) {
    const debt = await this.prisma.debt.delete({ where: { id } });
    await this.invalidateCache(debt.userId);
    return debt;
  }

  generateCsv(debts: Debt[], res: Response, filename = 'debts.csv') {
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    debts.forEach((row) => csvStream.write(row));
    csvStream.end();
  }

  async countDebts(userId: User['id']): Promise<DebtCounters> {
    const key = this.countersKey(userId);
    const cached = await this.cacheManager.get<DebtCounters>(key);
    if (cached) return cached;

    const pendingBalance = await this.prisma.debt.aggregate({
      where: { userId, paid: false },
      _sum: { amount: true },
    });
    const paidDebts = await this.prisma.debt.count({
      where: { userId, paid: true },
    });

    const result: DebtCounters = {
      pendingBalance: pendingBalance._sum.amount || 0,
      paidDebts,
    };

    await this.cacheManager.set(key, result, this.COUNTERS_CACHE_TTL);
    return result;
  }

  private countersKey(userId: User['id']): string {
    return `debts-counters:${userId}`;
  }

  private debtsUnpaginatedKey(userId: User['id']): string {
    return `debts-list:${userId}`;
  }

  private debtsPaginatedKey(userId: User['id'], skip: number, take: number) {
    return `debts-list:${userId}:skip=${skip}:take=${take}`;
  }

  private async invalidateCache(userId: User['id']): Promise<void> {
    await this.cacheManager.del(this.countersKey(userId));
    await this.cacheManager.del(this.debtsUnpaginatedKey(userId));
    await this.cacheManager.del(this.debtsPaginatedKey(userId, 0, 10));
  }
}
