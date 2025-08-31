import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DebtsModule } from './debts/debts.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

@Module({
  imports: [DebtsModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
