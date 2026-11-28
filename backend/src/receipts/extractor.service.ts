import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { openRouterExtract, type ExtractionInput } from './openrouter.client.js';
import { receiptExtractionSchema, type ReceiptExtraction } from './receipt.schema.js';

const SYSTEM = `Lees facturas, recibos, comprobantes de pago y estados de cuenta de Panamá y devuelves sus datos.
- La moneda en Panamá es el dólar (USD); "B/." (balboa) equivale a USD.
- El ITBMS es el impuesto al consumo.
- Fechas en formato AAAA-MM-DD. Si el documento usa dd/mm/aaaa, conviértelo.
- Montos con punto decimal, sin símbolos ni separadores de miles.
- category es una categoría genérica del gasto según el comercio y los productos.
- Si un dato no aparece o no es legible, usa null. No inventes datos.`;

export type AiProvider = 'anthropic' | 'openrouter';

/** Qué proveedor usar según la configuración (null = extracción desactivada). */
export function resolveProvider(choice: 'auto' | AiProvider, keys: { anthropic: string; openrouter: string }): AiProvider | null {
  if (choice === 'anthropic') return keys.anthropic ? 'anthropic' : null;
  if (choice === 'openrouter') return keys.openrouter ? 'openrouter' : null;
  if (keys.anthropic) return 'anthropic';
  if (keys.openrouter) return 'openrouter';
  return null;
}

/**
 * Extracción con IA: Anthropic directo o a través de OpenRouter (AI_PROVIDER). Sin la clave del
 * proveedor elegido, la función queda desactivada.
 */
@Injectable()
export class ExtractorService {
  private readonly logger = new Logger(ExtractorService.name);
  readonly provider: AiProvider | null;
  readonly model: string;
  private readonly anthropic: Anthropic | null = null;
  private readonly openRouterKey: string;

  constructor(config: ConfigService<Env, true>) {
    const anthropicKey = config.get('ANTHROPIC_API_KEY', { infer: true });
    this.openRouterKey = config.get('OPENROUTER_API_KEY', { infer: true });
    this.provider = resolveProvider(config.get('AI_PROVIDER', { infer: true }), { anthropic: anthropicKey, openrouter: this.openRouterKey });
    if (this.provider === 'anthropic') this.anthropic = new Anthropic({ apiKey: anthropicKey });
    this.model = this.provider === 'openrouter' ? config.get('OPENROUTER_MODEL', { infer: true }) : config.get('EXTRACTION_MODEL', { infer: true });
  }

  get configured() {
    return this.provider !== null;
  }

  /**
   * Con texto de OCR, a la IA solo le llega el TEXTO (la imagen no sale del servidor).
   * Sin OCR, se envía la imagen.
   */
  async extract(input: ExtractionInput): Promise<ReceiptExtraction> {
    if (this.provider === 'openrouter') {
      const r = await openRouterExtract({ apiKey: this.openRouterKey, model: this.model, system: SYSTEM }, input);
      this.logger.debug(`Extracción (OpenRouter): ${r.usage.input} tokens de entrada, ${r.usage.output} de salida (${r.model})`);
      return r.extraction;
    }
    if (!this.anthropic) throw new Error('Extracción no configurada (falta ANTHROPIC_API_KEY u OPENROUTER_API_KEY)');
    const content: Anthropic.Beta.BetaContentBlockParam[] =
      'ocrText' in input
        ? [{ type: 'text', text: `Texto leído por OCR de una factura (puede tener errores de lectura):\n\n${input.ocrText}` }]
        : [
            { type: 'image', source: { type: 'base64', media_type: input.mediaType, data: input.image.toString('base64') } },
            { type: 'text', text: 'Extrae los datos de este documento.' },
          ];
    const response = await this.anthropic.beta.messages.parse({
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
    this.logger.debug(`Extracción (Anthropic): ${response.usage.input_tokens} tokens de entrada, ${response.usage.output_tokens} de salida (${response.model})`);
    return response.parsed_output;
  }
}
