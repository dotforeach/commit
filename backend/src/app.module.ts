import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { Env } from './config/env.schema.js';
import { RatesModule } from './rates/rates.module.js';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountsModule } from './accounts/accounts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { DebtsModule } from './debts/debts.module.js';
import { DepositsModule } from './deposits/deposits.js';
import { GoalsModule } from './goals/goals.js';
import { InvestmentsModule } from './investments/investments.js';
import { InstallmentsModule } from './installments/installments.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { RecurringModule } from './recurring/recurring.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { CurrenciesModule } from './currencies/currencies.module.js';
import { envSchema } from './config/env.schema.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    PrismaModule,
    RedisModule,
    // BullMQ usa su propia conexión a Redis (los workers necesitan maxRetriesPerRequest: null).
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const url = new URL(config.get('REDIS_URL', { infer: true }));
        return {
          connection: { host: url.hostname, port: Number(url.port || 6379), password: decodeURIComponent(url.password) || undefined, maxRetriesPerRequest: null },
        };
      },
    }),
    AuthModule, // su guard global corre antes que el throttler
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 300 }] }),
    HealthModule,
    CurrenciesModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    RecurringModule,
    BudgetsModule,
    DebtsModule,
    InstallmentsModule,
    GoalsModule,
    DepositsModule,
    InvestmentsModule,
    RatesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
