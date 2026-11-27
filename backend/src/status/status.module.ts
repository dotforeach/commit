import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { StatusController } from './status.controller.js';
import { StatusService } from './status.service.js';

@Module({
  imports: [BullModule.registerQueue({ name: 'reminders' }, { name: 'rates' }, { name: 'receipts' })],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
