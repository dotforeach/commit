import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { receiptExtractionSchema, type ReceiptExtraction } from './receipt.schema.js';

const SYSTEM = `Lees facturas, recibos, comprobantes de pago y estados de cuenta de Panamá y devuelves sus datos.
- La moneda en Panamá es el dólar (USD); "B/." (balboa) equivale a USD.
- El ITBMS es el impuesto al consumo.
- Fechas en formato AAAA-MM-DD. Si el documento usa dd/mm/aaaa, conviértelo.
- Montos con punto decimal, sin símbolos ni separadores de miles.
- category es una categoría genérica del gasto según el comercio y los productos.
- Si un dato no aparece o no es legible, usa null. No inventes datos.`;

/** Extracción con Claude. Sin ANTHROPIC_API_KEY la función queda desactivada. */
@Injectable()
export class ExtractorService {
  private readonly logger = new Logger(ExtractorService.name);
  private readonly client: Anthropic | null;
  private readonly model: string;

  constructor(config: ConfigService<Env, true>) {
    const apiKey = config.get('ANTHROPIC_API_KEY', { infer: true });
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    this.model = config.get('EXTRACTION_MODEL', { infer: true });
  }

  get configured() {
    return this.client !== null;
  }

  /**
   * Con texto de OCR, a la IA solo le llega el TEXTO (la imagen no sale del servidor).
   * Sin OCR, se envía la imagen.
   */
  async extract(input: { ocrText: string } | { image: Buffer; mediaType: 'image/jpeg' | 'image/png' | 'image/webp' }): Promise<ReceiptExtraction> {
    if (!this.client) throw new Error('Extracción no configurada (falta ANTHROPIC_API_KEY)');
    const content: Anthropic.Beta.BetaContentBlockParam[] =
      'ocrText' in input
        ? [{ type: 'text', text: `Texto leído por OCR de una factura (puede tener errores de lectura):\n\n${input.ocrText}` }]
        : [
            { type: 'image', source: { type: 'base64', media_type: input.mediaType, data: input.image.toString('base64') } },
            { type: 'text', text: 'Extrae los datos de este documento.' },
          ];
    const response = await this.client.beta.messages.parse({
      model: this.model,
      max_tokens: 4000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [{ role: 'user', content }],
      output_config: { format: betaZodOutputFormat(receiptExtractionSchema) },
    });
    if (response.stop_reason === 'refusal') throw new Error('El modelo no procesó el documento');
    if (!response.parsed_output) throw new Error('Respuesta sin datos válidos');
    this.logger.debug(`Extracción: ${response.usage.input_tokens} tokens de entrada, ${response.usage.output_tokens} de salida (${response.model})`);
    return response.parsed_output;
  }
}
