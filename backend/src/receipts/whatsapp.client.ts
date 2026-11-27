import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';

/** WhatsApp Cloud API (Meta): descargar fotos y responder. Sin credenciales, desactivado. */
@Injectable()
export class WhatsappClient {
  private readonly env: Pick<Env, 'WHATSAPP_TOKEN' | 'WHATSAPP_PHONE_NUMBER_ID' | 'WHATSAPP_APP_SECRET' | 'WHATSAPP_VERIFY_TOKEN' | 'WHATSAPP_GRAPH_VERSION' | 'WHATSAPP_DISPLAY_NUMBER'>;
  private readonly phoneKey: string;

  constructor(config: ConfigService<Env, true>) {
    const get = <K extends keyof Env>(k: K) => config.get(k, { infer: true }) as Env[K];
    this.env = {
      WHATSAPP_TOKEN: get('WHATSAPP_TOKEN'),
      WHATSAPP_PHONE_NUMBER_ID: get('WHATSAPP_PHONE_NUMBER_ID'),
      WHATSAPP_APP_SECRET: get('WHATSAPP_APP_SECRET'),
      WHATSAPP_VERIFY_TOKEN: get('WHATSAPP_VERIFY_TOKEN'),
      WHATSAPP_GRAPH_VERSION: get('WHATSAPP_GRAPH_VERSION'),
      WHATSAPP_DISPLAY_NUMBER: get('WHATSAPP_DISPLAY_NUMBER'),
    };
    this.phoneKey = get('PHONE_HASH_KEY') || `phone:${get('JWT_SECRET')}`;
  }

  get configured() {
    return !!(this.env.WHATSAPP_TOKEN && this.env.WHATSAPP_PHONE_NUMBER_ID && this.env.WHATSAPP_APP_SECRET);
  }

  get displayNumber() {
    return this.env.WHATSAPP_DISPLAY_NUMBER || null;
  }

  verifyToken(token: string) {
    return !!this.env.WHATSAPP_VERIFY_TOKEN && token === this.env.WHATSAPP_VERIFY_TOKEN;
  }

  /** Firma de Meta: X-Hub-Signature-256 = "sha256=" + HMAC-SHA256(app secret, cuerpo exacto). */
  verifySignature(rawBody: Buffer | undefined, header: string | undefined): boolean {
    if (!this.env.WHATSAPP_APP_SECRET || !rawBody || !header?.startsWith('sha256=')) return false;
    const expected = createHmac('sha256', this.env.WHATSAPP_APP_SECRET).update(rawBody).digest();
    const given = Buffer.from(header.slice(7), 'hex');
    return given.length === expected.length && timingSafeEqual(given, expected);
  }

  /** Identificador del número sin guardarlo: HMAC con una clave del servidor. */
  hashPhone(waId: string) {
    return createHmac('sha256', this.phoneKey).update(waId.replace(/\D/g, '')).digest('hex');
  }

  private graph(path: string) {
    return `https://graph.facebook.com/${this.env.WHATSAPP_GRAPH_VERSION}/${path}`;
  }

  async downloadMedia(mediaId: string): Promise<{ data: Buffer; mimeType: string }> {
    const auth = { authorization: `Bearer ${this.env.WHATSAPP_TOKEN}` };
    const meta = await fetch(this.graph(mediaId), { headers: auth, signal: AbortSignal.timeout(15_000) });
    if (!meta.ok) throw new Error(`WhatsApp media: HTTP ${meta.status}`);
    const { url, mime_type } = (await meta.json()) as { url: string; mime_type: string };
    const file = await fetch(url, { headers: auth, signal: AbortSignal.timeout(30_000) });
    if (!file.ok) throw new Error(`WhatsApp media download: HTTP ${file.status}`);
    return { data: Buffer.from(await file.arrayBuffer()), mimeType: mime_type };
  }

  async sendText(to: string, body: string): Promise<void> {
    if (!this.configured) return;
    await fetch(this.graph(`${this.env.WHATSAPP_PHONE_NUMBER_ID}/messages`), {
      method: 'POST',
      headers: { authorization: `Bearer ${this.env.WHATSAPP_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
      signal: AbortSignal.timeout(15_000),
    });
  }
}
