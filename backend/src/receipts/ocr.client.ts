import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';

/** Cliente del servicio de OCR propio (PaddleOCR, contenedor `ocr`). Opcional. */
@Injectable()
export class OcrClient {
  private readonly url: string;

  constructor(config: ConfigService<Env, true>) {
    this.url = config.get('OCR_URL', { infer: true }).replace(/\/$/, '');
  }

  get configured() {
    return this.url !== '';
  }

  async read(image: Buffer): Promise<string> {
    const res = await fetch(`${this.url}/ocr`, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: new Uint8Array(image),
      // En Azure el OCR escala a cero: el primer pedido tras un rato espera a que arranque
      signal: AbortSignal.timeout(150_000),
    });
    if (!res.ok) throw new Error(`OCR: HTTP ${res.status}`);
    const { text } = (await res.json()) as { text: string };
    return text;
  }
}
