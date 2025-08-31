import { Injectable } from '@nestjs/common';
import { format } from 'fast-csv';

import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from '../prisma.service';
import { Debt, Prisma, User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDebtDto: CreateDebtDto, userId: User['id']) {
    return this.prisma.debt.create({
      data: {
        amount: createDebtDto.amount,
        description: createDebtDto.description,
        dueDate: createDebtDto.dueDate,
        userId: userId,
      },
    });
  }

  findAll(userId: User['id'], description?: string, paid?: boolean) {
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

    return this.prisma.debt.findMany({ where: query });
  }

  findOne(id: number) {
    return this.prisma.debt.findUnique({ where: { id } });
  }

  update(id: number, updateDebtDto: UpdateDebtDto) {
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

    return this.prisma.debt.update({
      where: { id },
      data,
    });
  }

  setPaid(id: number, paid: boolean) {
    return this.prisma.debt.update({
      where: { id },
      data: { paid },
    });
  }

  remove(id: number) {
    return this.prisma.debt.delete({ where: { id } });
  }

  generateCsv(debts: Debt[], res: Response, filename = 'debts.csv') {
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    debts.forEach((row) => csvStream.write(row));
    csvStream.end();
  }

  async countDebts(
    userId: User['id'],
  ): Promise<{ pendingBalance: number; paidDebts: number }> {
    const pendingBalance = await this.prisma.debt.aggregate({
      where: { userId, paid: false },
      _sum: { amount: true },
    });
    const paidDebts = await this.prisma.debt.count({
      where: { userId, paid: true },
    });
    return {
      pendingBalance: pendingBalance._sum.amount || 0,
      paidDebts,
    };
  }
}
