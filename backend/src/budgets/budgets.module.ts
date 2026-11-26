import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { BudgetsController } from './budgets.controller.js';
import { BudgetsService } from './budgets.service.js';

@Module({ imports: [HouseholdsModule], controllers: [BudgetsController], providers: [BudgetsService] })
export class BudgetsModule {}
