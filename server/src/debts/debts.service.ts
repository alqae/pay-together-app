import { Injectable } from '@nestjs/common';

import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';

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
}
