import { Module } from '@nestjs/common';
import { HouseholdAccessService } from './household-access.service.js';

@Module({
  providers: [HouseholdAccessService],
  exports: [HouseholdAccessService],
})
export class HouseholdsModule {}
