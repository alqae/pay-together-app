import { CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Keyv } from 'keyv';

import { UsersModule } from './users/users.module';
import { DebtsModule } from './debts/debts.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

console.log('process.env.REDIS_URL', process.env.REDIS_URL);

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv(process.env.REDIS_URL),
          ],
        };
      },
    }),
    DebtsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
