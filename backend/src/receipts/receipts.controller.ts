import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpCode, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { CurrentUser, Public } from '@nestjs/authentication';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Queue } from 'bullmq';
import type { Request } from 'express';
import { z } from 'zod';
import { AccountService } from '../auth/account.service.js';
import { toBase64 } from '../common/base64.js';
import { receiptExtractionSchema } from './receipt.schema.js';
import { RECEIPTS_QUEUE, type ReceiptJob } from './receipts.processor.js';
import { PLANS, ReceiptsService } from './receipts.service.js';
import { WhatsappClient } from './whatsapp.client.js';

const linkSchema = z.object({ consent: z.literal(true) });
const planSchema = z.object({ plan: z.enum(['MONTHLY', 'YEARLY']) });
const MAX_IMAGE = 8 * 1024 * 1024;

/** Lo que usa la app: vincular WhatsApp, bandeja "Por revisar" (sellada) y suscripción. */
@Controller('me')
export class ReceiptsController {
  constructor(
    private readonly receipts: ReceiptsService,
    private readonly account: AccountService,
  ) {}

  @Get('whatsapp')
  status(@CurrentUser('id') userId: string) {
    return this.receipts.status(userId);
  }

  @Post('whatsapp/link-code')
  async linkCode(@CurrentUser('id') userId: string, @Body({ schema: linkSchema }) _body: z.infer<typeof linkSchema>) {
    await this.account.assertVerified(userId);
    return this.receipts.createLinkCode(userId);
  }

  @Delete('whatsapp')
  @HttpCode(204)
  async unlink(@CurrentUser('id') userId: string) {
    await this.receipts.unlink(userId);
  }

  @Get('receipts')
  async list(@CurrentUser('id') userId: string) {
    const items = await this.receipts.list(userId);
    return { items: items.map((i) => ({ id: i.id, sealed: toBase64(i.sealed), createdAt: i.createdAt })) };
  }

  @Delete('receipts/:id')
  @HttpCode(204)
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.receipts.remove(userId, id);
  }

  /** Subir una foto desde la app (además de WhatsApp). Mismo procesamiento y mismo sellado. */
  @Post('receipts/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMAGE } }))
  async upload(@CurrentUser('id') userId: string, @UploadedFile() file: { buffer: Buffer; mimetype: string } | undefined) {
    if (!file) throw new BadRequestException('Falta la imagen');
    const reason = await this.receipts.rejectionReason(userId);
    if (reason) throw new BadRequestException(reason === 'limit' ? 'Llegaste al límite de comprobantes de este mes' : 'Necesitas una suscripción activa');
    await this.receipts.process(userId, file.buffer, file.mimetype, 'upload');
    return { ok: true };
  }

  @Get('subscription')
  async subscription(@CurrentUser('id') userId: string) {
    return { subscription: await this.receipts.subscription(userId), plans: PLANS };
  }

  /** Sin proveedor de pago configurado todavía: se informa. */
  @Post('subscription/checkout')
  async checkout(@CurrentUser('id') userId: string, @Body({ schema: planSchema }) _body: z.infer<typeof planSchema>) {
    await this.account.assertVerified(userId);
    throw new BadRequestException('El cobro todavía no está disponible: falta configurar el proveedor de pago.');
  }

  // ── Solo desarrollo (para probar sin Meta, sin IA y sin pagos) ──
  @Post('subscription/dev-activate')
  devActivate(@CurrentUser('id') userId: string, @Body({ schema: planSchema }) body: z.infer<typeof planSchema>) {
    this.receipts.assertDev();
    return this.receipts.devActivate(userId, body.plan);
  }

  @Post('receipts/dev-sample')
  @HttpCode(204)
  async devSample(@CurrentUser('id') userId: string, @Body({ schema: receiptExtractionSchema }) extraction: z.infer<typeof receiptExtractionSchema>) {
    this.receipts.assertDev();
    await this.receipts.store(userId, { v: 1, source: 'upload', receivedAt: new Date().toISOString(), extraction });
  }
}

/** Webhook de la WhatsApp Cloud API (Meta). Público, validado con la firma de Meta. */
@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  constructor(
    private readonly receipts: ReceiptsService,
    private readonly whatsapp: WhatsappClient,
    @InjectQueue(RECEIPTS_QUEUE) private readonly queue: Queue<ReceiptJob>,
  ) {}

  /** Verificación al configurar el webhook en Meta. */
  @Public()
  @Get()
  verify(@Query('hub.mode') mode: string, @Query('hub.verify_token') token: string, @Query('hub.challenge') challenge: string) {
    if (mode === 'subscribe' && this.whatsapp.verifyToken(token)) return challenge;
    throw new BadRequestException();
  }

  @Public()
  @Post()
  @HttpCode(200)
  async receive(@Req() req: Request & { rawBody?: Buffer }, @Headers('x-hub-signature-256') signature: string | undefined) {
    if (!this.whatsapp.verifySignature(req.rawBody, signature)) throw new BadRequestException('Firma inválida');
    for (const msg of extractMessages(req.body)) {
      // Meta reenvía el mismo mensaje si no recibe respuesta a tiempo (p. ej. mientras el backend
      // despierta): cada mensaje se procesa una sola vez.
      if (!(await this.receipts.firstDelivery(msg.id))) continue;
      await this.handle(msg).catch(() => undefined);
    }
    return { ok: true };
  }

  private async handle(msg: IncomingMessage) {
    if (msg.type === 'text') {
      const linked = await this.receipts.linkFromMessage(msg.from, msg.text);
      await this.whatsapp.sendText(
        msg.from,
        linked
          ? '🐷 ¡Listo! Tu WhatsApp quedó vinculado a Commit. Envíame fotos de tus facturas y recibos.'
          : 'Hola 👋 Envíame una foto de tu factura o recibo. Para vincular tu cuenta, genera un código en Commit → Ajustes → WhatsApp.',
      );
      return;
    }
    const link = await this.receipts.userForPhone(msg.from);
    if (!link) {
      await this.whatsapp.sendText(msg.from, 'Este número no está vinculado. En Commit, ve a Ajustes → WhatsApp para vincularlo.');
      return;
    }
    const reason = await this.receipts.rejectionReason(link.userId);
    if (reason) {
      await this.receipts.reject(link.userId);
      await this.whatsapp.sendText(
        msg.from,
        reason === 'limit' ? 'Llegaste al límite de comprobantes de este mes.' : 'Para procesar comprobantes necesitas la suscripción de Commit ($2 al mes o $20 al año).',
      );
      return;
    }
    await this.queue.add('receipt', { userId: link.userId, waId: msg.from, mediaId: msg.mediaId }, { attempts: 2, removeOnComplete: true, removeOnFail: true });
    await this.whatsapp.sendText(msg.from, '📸 Recibido. Lo estoy leyendo…');
  }
}

/** `id`: identificador del mensaje en WhatsApp (wamid), para no procesar dos veces un reenvío de Meta. */
type IncomingMessage = { id?: string; from: string } & ({ type: 'text'; text: string } | { type: 'image'; mediaId: string });

/** Extrae los mensajes de texto e imagen del payload de Meta (ignora estados y otros tipos). */
export function extractMessages(body: unknown): IncomingMessage[] {
  const out: IncomingMessage[] = [];
  const entries = (body as { entry?: { changes?: { value?: { messages?: Record<string, unknown>[] } }[] }[] })?.entry ?? [];
  for (const e of entries)
    for (const c of e.changes ?? [])
      for (const m of c.value?.messages ?? []) {
        const from = typeof m['from'] === 'string' ? m['from'] : null;
        if (!from) continue;
        const id = typeof m['id'] === 'string' ? m['id'] : undefined;
        if (m['type'] === 'text') out.push({ id, from, type: 'text', text: String((m['text'] as { body?: string })?.body ?? '') });
        if (m['type'] === 'image') {
          const mediaId = (m['image'] as { id?: string })?.id;
          if (mediaId) out.push({ id, from, type: 'image', mediaId });
        }
      }
  return out;
}
