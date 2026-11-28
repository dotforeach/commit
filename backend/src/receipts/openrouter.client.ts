import { z } from 'zod';
import { receiptExtractionSchema, type ReceiptExtraction } from './receipt.schema.js';

/**
 * Extracción de comprobantes a través de OpenRouter (API compatible con chat completions).
 *
 * Privacidad: a OpenRouter (y al proveedor del modelo) le llega el texto del OCR o, sin OCR, la
 * imagen. Por eso cada pedido exige proveedores con retención cero (`zdr`) y sin recolección de
 * datos (`data_collection: deny`). Si ningún proveedor del modelo cumple en ese momento, el pedido
 * falla y el comprobante queda con error para reintentar: nunca se manda a uno que guarde datos.
 */
export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ExtractionInput = { ocrText: string } | { image: Buffer; mediaType: 'image/jpeg' | 'image/png' | 'image/webp' };

/** Palabras de JSON Schema que no todos los proveedores aceptan: se validan después con Zod. */
const UNSUPPORTED = new Set(['$schema', 'pattern', 'format', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'minLength', 'maxLength', 'minItems', 'maxItems']);

function strip(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(strip);
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) if (!UNSUPPORTED.has(k)) out[k] = strip(v);
    // Modo estricto: objetos cerrados y con todas sus propiedades obligatorias (los opcionales son null)
    if (out.type === 'object' && out.properties && typeof out.properties === 'object') {
      out.additionalProperties = false;
      out.required = Object.keys(out.properties);
    }
    return out;
  }
  return node;
}

/** Esquema JSON que se envía como `response_format` (la validación completa la hace Zod). */
export const receiptJsonSchema = strip(z.toJSONSchema(receiptExtractionSchema)) as Record<string, unknown>;

export function buildRequest(model: string, system: string, input: ExtractionInput) {
  const userContent =
    'ocrText' in input
      ? [{ type: 'text', text: `Texto leído por OCR de una factura (puede tener errores de lectura):\n\n${input.ocrText}` }]
      : [
          { type: 'image_url', image_url: { url: `data:${input.mediaType};base64,${input.image.toString('base64')}` } },
          { type: 'text', text: 'Extrae los datos de este documento.' },
        ];
  return {
    model,
    max_tokens: 4000,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_schema', json_schema: { name: 'receipt_extraction', strict: true, schema: receiptJsonSchema } },
    provider: {
      zdr: true, // solo proveedores con retención cero
      data_collection: 'deny', // y que no usen los datos
      require_parameters: true, // y que soporten la respuesta estructurada
    },
  };
}

interface ChatResponse {
  model?: string;
  choices?: { finish_reason?: string; message?: { content?: string | null; refusal?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string; code?: number | string };
}

export interface OpenRouterResult {
  extraction: ReceiptExtraction;
  model: string | null;
  usage: { input: number; output: number };
}

/** Interpreta la respuesta: error del servicio, rechazo del modelo o JSON que no cumple el esquema. */
export function parseResponse(status: number, body: ChatResponse): OpenRouterResult {
  if (status !== 200 || body.error) {
    throw new Error(`OpenRouter respondió ${status}: ${body.error?.message ?? 'sin detalle'}`);
  }
  const choice = body.choices?.[0];
  if (choice?.message?.refusal) throw new Error('El modelo no procesó el documento');
  const content = choice?.message?.content;
  if (!content) throw new Error(`Respuesta sin datos (${choice?.finish_reason ?? 'sin motivo'})`);
  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    throw new Error('Respuesta que no es JSON');
  }
  const parsed = receiptExtractionSchema.safeParse(json);
  if (!parsed.success) throw new Error('Respuesta sin datos válidos');
  return {
    extraction: parsed.data,
    model: body.model ?? null,
    usage: { input: body.usage?.prompt_tokens ?? 0, output: body.usage?.completion_tokens ?? 0 },
  };
}

export async function openRouterExtract(
  opts: { apiKey: string; model: string; system: string; fetchImpl?: typeof fetch; timeoutMs?: number },
  input: ExtractionInput,
): Promise<OpenRouterResult> {
  const res = await (opts.fetchImpl ?? fetch)(OPENROUTER_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'Commit' },
    body: JSON.stringify(buildRequest(opts.model, opts.system, input)),
    signal: AbortSignal.timeout(opts.timeoutMs ?? 90_000),
  });
  const body = (await res.json().catch(() => ({}))) as ChatResponse;
  return parseResponse(res.status, body);
}
