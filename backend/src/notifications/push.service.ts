import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import type { Env } from '../config/env.schema.js';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Envío Web Push. El contenido es SIEMPRE genérico (sin datos financieros): el servicio de push del
 * navegador (Google, Mozilla, Apple) solo ve "Tenés un recordatorio". El detalle se descifra en la app.
 */
@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);
  private enabled = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  onModuleInit() {
    const publicKey = this.config.get('VAPID_PUBLIC_KEY', { infer: true });
    const privateKey = this.config.get('VAPID_PRIVATE_KEY', { infer: true });
    if (publicKey && privateKey) {
      webpush.setVapidDetails(this.config.get('VAPID_SUBJECT', { infer: true }), publicKey, privateKey);
      this.enabled = true;
    } else {
      this.logger.warn('Sin claves VAPID: no se envían notificaciones push (solo en la app)');
    }
  }

  publicKey(): string | null {
    return this.enabled ? this.config.get('VAPID_PUBLIC_KEY', { infer: true }) : null;
  }

  /** Avisa a todos los dispositivos del usuario. Las suscripciones vencidas se borran. */
  async notify(userId: string, body: string): Promise<number> {
    if (!this.enabled) return 0;
    const subs = await this.prisma.pushSubscription.findMany({ where: { userId } });
    const message = JSON.stringify({
      notification: {
        title: 'Finanzas 0→100',
        body,
        icon: '/icons/icon-192x192.png',
        data: { onActionClick: { default: { operation: 'navigateLastFocusedOrOpen', url: '/inicio' } } },
      },
    });
    let sent = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, message, { TTL: 24 * 3600 });
        sent++;
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) await this.prisma.pushSubscription.deleteMany({ where: { id: s.id } });
        else this.logger.warn(`Push fallido (${status ?? 'sin estado'})`);
      }
    }
    return sent;
  }
}
