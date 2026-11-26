import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { DebtsController } from './debts.controller.js';
import { DebtsService } from './debts.service.js';

@Module({ imports: [HouseholdsModule], controllers: [DebtsController], providers: [DebtsService] })
export class DebtsModule {}
