import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { RateSources } from './rate-sources.js';
import { HouseholdRatesController, HouseholdRatesService, PublicRatesController } from './rates.controller.js';
import { RATES_QUEUE, RatesProcessor, RatesScheduler } from './rates.processor.js';
import { RatesService } from './rates.service.js';

@Module({
  imports: [HouseholdsModule, BullModule.registerQueue({ name: RATES_QUEUE })],
  controllers: [PublicRatesController, HouseholdRatesController],
  providers: [RateSources, RatesService, RatesProcessor, RatesScheduler, HouseholdRatesService],
  exports: [RatesService],
})
export class RatesModule {}
