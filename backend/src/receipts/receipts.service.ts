import { randomInt } from 'node:crypto';
import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Redis } from 'ioredis';
import sodium from 'libsodium-wrappers';
import type { Env } from '../config/env.schema.js';
import { PushService } from '../notifications/push.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { REDIS } from '../redis/redis.constants.js';
import { ExtractorService } from './extractor.service.js';
import { OcrClient } from './ocr.client.js';
import type { ReceiptExtraction } from './receipt.schema.js';
import { WhatsappClient } from './whatsapp.client.js';

export const PLANS = { MONTHLY: { price: 2, months: 1 }, YEARLY: { price: 20, months: 12 } } as const;
const LINK_TTL_SECONDS = 600;
const linkKey = (code: string) => `wa:link:${code}`;

/** Lo que va sellado para el usuario (el servidor no puede volver a leerlo). */
export interface SealedReceipt {
  v: 1;
  source: 'whatsapp' | 'upload';
  receivedAt: string;
  extraction: ReceiptExtraction;
}

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Env, true>,
    private readonly whatsapp: WhatsappClient,
    private readonly ocr: OcrClient,
    private readonly extractor: ExtractorService,
    private readonly push: PushService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  // ── Vinculación ─────────────────────────────────────────────────────────────
  async status(userId: string) {
    const [link, subscription, used] = await Promise.all([
      this.prisma.whatsappLink.findUnique({ where: { userId } }),
      this.subscription(userId),
      this.usedThisMonth(userId),
    ]);
    return {
      configured: this.whatsapp.configured && this.extractor.configured,
      whatsappConfigured: this.whatsapp.configured,
      extractionConfigured: this.extractor.configured,
      ocr: this.ocr.configured,
      number: this.whatsapp.displayNumber,
      linked: !!link,
      linkedAt: link?.linkedAt ?? null,
      subscription,
      subscriptionRequired: this.config.get('SUBSCRIPTIONS_ENFORCED', { infer: true }),
      monthlyLimit: this.config.get('RECEIPTS_MONTHLY_LIMIT', { infer: true }),
      usedThisMonth: used,
    };
  }

  /** Código de un solo uso (10 min) que la persona envía por WhatsApp para vincular su número. */
  async createLinkCode(userId: string) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await this.redis.set(linkKey(code), userId, 'EX', LINK_TTL_SECONDS);
    const text = `COMMIT-${code}`;
    const number = this.whatsapp.displayNumber;
    return {
      code: text,
      expiresAt: new Date(Date.now() + LINK_TTL_SECONDS * 1000).toISOString(),
      waLink: number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null,
    };
  }

  /** Desde el webhook: si el mensaje trae un código válido, vincula ese número a la cuenta. */
  async linkFromMessage(waId: string, text: string): Promise<boolean> {
    const m = /COMMIT[-\s]?(\d{6})/i.exec(text);
    if (!m) return false;
    const userId = await this.redis.getdel(linkKey(m[1]));
    if (!userId) return false;
    const phoneHash = this.whatsapp.hashPhone(waId);
    await this.prisma.$transaction([
      this.prisma.whatsappLink.deleteMany({ where: { OR: [{ phoneHash }, { userId }] } }),
      this.prisma.whatsappLink.create({ data: { userId, phoneHash, consentAt: new Date() } }),
    ]);
    return true;
  }

  async unlink(userId: string) {
    await this.prisma.whatsappLink.deleteMany({ where: { userId } });
  }

  userForPhone(waId: string) {
    return this.prisma.whatsappLink.findUnique({ where: { phoneHash: this.whatsapp.hashPhone(waId) } });
  }

  // ── Suscripción y límites ───────────────────────────────────────────────────
  subscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId }, select: { plan: true, status: true, currentPeriodEnd: true } });
  }

  private usedThisMonth(userId: string) {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    return this.prisma.receiptEvent.count({ where: { userId, status: 'PROCESSED', createdAt: { gte: start } } });
  }

  /** null si puede procesar; si no, el motivo (para responder por WhatsApp). */
  async rejectionReason(userId: string): Promise<'subscription' | 'limit' | null> {
    if (this.config.get('SUBSCRIPTIONS_ENFORCED', { infer: true })) {
      const sub = await this.subscription(userId);
      if (!sub || sub.status !== 'ACTIVE' || sub.currentPeriodEnd < new Date()) return 'subscription';
    }
    if ((await this.usedThisMonth(userId)) >= this.config.get('RECEIPTS_MONTHLY_LIMIT', { infer: true })) return 'limit';
    return null;
  }

  async reject(userId: string) {
    await this.prisma.receiptEvent.create({ data: { userId, status: 'REJECTED' } });
  }

  /** Solo en desarrollo: activa una suscripción de prueba (no hay proveedor de pago todavía). */
  async devActivate(userId: string, plan: keyof typeof PLANS) {
    const end = new Date();
    end.setMonth(end.getMonth() + PLANS[plan].months);
    return this.prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan, status: 'ACTIVE', currentPeriodEnd: end, provider: 'dev' },
      update: { plan, status: 'ACTIVE', currentPeriodEnd: end, provider: 'dev' },
      select: { plan: true, status: true, currentPeriodEnd: true },
    });
  }

  // ── Procesamiento ───────────────────────────────────────────────────────────
  /** Foto → OCR (si hay) → IA → resultado sellado en la bandeja. La foto se descarta. */
  async process(userId: string, image: Buffer, mimeType: string, source: SealedReceipt['source']): Promise<ReceiptExtraction> {
    try {
      let extraction: ReceiptExtraction;
      if (this.ocr.configured) {
        extraction = await this.extractor.extract({ ocrText: await this.ocr.read(image) });
      } else {
        const mediaType = (['image/jpeg', 'image/png', 'image/webp'] as const).find((t) => t === mimeType);
        if (!mediaType) throw new Error(`Formato no soportado: ${mimeType}`);
        extraction = await this.extractor.extract({ image, mediaType });
      }
      await this.store(userId, { v: 1, source, receivedAt: new Date().toISOString(), extraction });
      await this.prisma.receiptEvent.create({ data: { userId, status: 'PROCESSED' } });
      await this.push.notify(userId, 'Tienes un comprobante nuevo para revisar en Commit.').catch(() => 0);
      return extraction;
    } catch (e) {
      await this.prisma.receiptEvent.create({ data: { userId, status: 'FAILED' } });
      this.logger.warn(`No se pudo procesar un comprobante: ${(e as Error).message}`);
      throw e;
    } finally {
      image.fill(0);
    }
  }

  /** Sella el resultado con la clave pública X25519 del usuario (crypto_box_seal). */
  async store(userId: string, receipt: SealedReceipt) {
    const keys = await this.prisma.userKeys.findUnique({ where: { userId }, select: { publicKey: true } });
    if (!keys) throw new NotFoundException('El usuario no tiene claves');
    await sodium.ready;
    const sealed = sodium.crypto_box_seal(new TextEncoder().encode(JSON.stringify(receipt)), new Uint8Array(keys.publicKey));
    await this.prisma.receiptInboxItem.create({ data: { userId, sealed: Buffer.from(sealed) } });
  }

  list(userId: string) {
    return this.prisma.receiptInboxItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { id: true, sealed: true, createdAt: true } });
  }

  async remove(userId: string, id: string) {
    const { count } = await this.prisma.receiptInboxItem.deleteMany({ where: { id, userId } });
    if (count === 0) throw new NotFoundException();
  }

  assertDev() {
    if (this.config.get('NODE_ENV', { infer: true }) === 'production') throw new ForbiddenException();
  }
}
