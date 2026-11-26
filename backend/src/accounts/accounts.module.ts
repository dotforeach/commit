import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';

@Module({
  imports: [HouseholdsModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
