import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { ReceiptsService } from './receipts.service.js';
import { WhatsappClient } from './whatsapp.client.js';

export const RECEIPTS_QUEUE = 'receipts';
export interface ReceiptJob {
  userId: string;
  waId: string;
  mediaId: string;
}

const fmt = (v: string | null) => (v ? `$${Number(v).toLocaleString('es-PA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '');

/** Procesa fotos recibidas por WhatsApp fuera del webhook (Meta exige responder rápido). */
@Processor(RECEIPTS_QUEUE, { concurrency: 2 })
export class ReceiptsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReceiptsProcessor.name);

  constructor(
    private readonly receipts: ReceiptsService,
    private readonly whatsapp: WhatsappClient,
  ) {
    super();
  }

  async process(job: Job<ReceiptJob>) {
    const { userId, waId, mediaId } = job.data;
    try {
      const media = await this.whatsapp.downloadMedia(mediaId);
      const x = await this.receipts.process(userId, media.data, media.mimeType, 'whatsapp');
      const what = [x.merchant, fmt(x.total)].filter(Boolean).join(' · ');
      await this.whatsapp.sendText(waId, `✅ Recibido${what ? `: ${what}` : ''}. Ábrelo en Commit → Por revisar para confirmarlo.`);
    } catch (e) {
      this.logger.warn(`Comprobante de WhatsApp: ${(e as Error).message}`);
      await this.whatsapp.sendText(waId, 'No pude leer este comprobante. Prueba con una foto más nítida, de frente y con buena luz.');
    }
  }
}
