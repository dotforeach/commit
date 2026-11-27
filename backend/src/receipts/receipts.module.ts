import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ExtractorService } from './extractor.service.js';
import { OcrClient } from './ocr.client.js';
import { ReceiptsController, WhatsappWebhookController } from './receipts.controller.js';
import { RECEIPTS_QUEUE, ReceiptsProcessor } from './receipts.processor.js';
import { ReceiptsService } from './receipts.service.js';
import { WhatsappClient } from './whatsapp.client.js';

@Module({
  imports: [NotificationsModule, BullModule.registerQueue({ name: RECEIPTS_QUEUE })],
  controllers: [ReceiptsController, WhatsappWebhookController],
  providers: [ReceiptsService, ReceiptsProcessor, WhatsappClient, OcrClient, ExtractorService],
})
export class ReceiptsModule {}
