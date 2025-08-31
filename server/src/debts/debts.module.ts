import { Module } from '@nestjs/common';

import { DebtsController } from './debts.controller';
import { PrismaService } from '../prisma.service';
import { DebtsService } from './debts.service';

@Module({
  controllers: [DebtsController],
  providers: [DebtsService, PrismaService],
})
export class DebtsModule {}
