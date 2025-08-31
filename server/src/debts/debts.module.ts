import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { DebtsController } from './debts.controller';
import { PrismaService } from '../prisma.service';
import { DebtsService } from './debts.service';

@Module({
  imports: [CacheModule.register({ ttl: 60000 })],
  controllers: [DebtsController],
  providers: [DebtsService, PrismaService],
})
export class DebtsModule {}
