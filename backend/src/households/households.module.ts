import { Module } from '@nestjs/common';
import { HouseholdAccessService } from './household-access.service.js';
import { MembersController, MembersService } from './members.js';

@Module({
  controllers: [MembersController],
  providers: [HouseholdAccessService, MembersService],
  exports: [HouseholdAccessService],
})
export class HouseholdsModule {}
