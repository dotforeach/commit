import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountsModule } from './accounts/accounts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { DebtsModule } from './debts/debts.module.js';
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
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
