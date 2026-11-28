import { buildRequest, openRouterExtract, OPENROUTER_URL, parseResponse, receiptJsonSchema } from './openrouter.client.js';
import { resolveProvider } from './extractor.service.js';

const valid = {
  documentType: 'purchase',
  merchant: 'Súper 99',
  date: '2026-11-27',
  total: '23.45',
  currency: 'USD',
  tax: '1.53',
  paymentMethod: 'debit_card',
  cardLast4: '1234',
  category: 'groceries',
  items: [{ description: 'Leche', amount: '2.10' }],
  statement: null,
  confidence: 0.92,
  notes: null,
};
const ok = (content: unknown) => ({ model: 'anthropic/claude-opus-5.5', choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(content) } }], usage: { prompt_tokens: 900, completion_tokens: 200 } });

describe('OpenRouter: pedido', () => {
  it('exige retención cero, sin recolección de datos y respuesta estructurada', () => {
    const req = buildRequest('anthropic/claude-opus-5.5', 'sistema', { ocrText: 'TOTAL 23.45' });
    expect(req.provider).toEqual({ zdr: true, data_collection: 'deny', require_parameters: true });
    expect(req.response_format).toMatchObject({ type: 'json_schema', json_schema: { name: 'receipt_extraction', strict: true } });
    expect(req.model).toBe('anthropic/claude-opus-5.5');
  });
  it('con OCR envía solo el texto; sin OCR, la imagen como data URL', () => {
    const text = buildRequest('m', 's', { ocrText: 'TOTAL 23.45' });
    expect(JSON.stringify(text.messages)).toContain('TOTAL 23.45');
    expect(JSON.stringify(text.messages)).not.toContain('image_url');
    const img = buildRequest('m', 's', { image: Buffer.from('abc'), mediaType: 'image/jpeg' });
    expect(JSON.stringify(img.messages)).toContain('data:image/jpeg;base64,YWJj');
  });
  it('el esquema enviado es estricto y sin palabras que algunos proveedores rechazan', () => {
    const s = JSON.stringify(receiptJsonSchema);
    expect(s).not.toMatch(/"pattern"|"minimum"|"maximum"|"maxItems"|"\$schema"/);
    expect(receiptJsonSchema).toMatchObject({ type: 'object', additionalProperties: false });
    expect((receiptJsonSchema as { required: string[] }).required).toContain('total');
  });
});

describe('OpenRouter: respuesta', () => {
  it('acepta un JSON válido', () => {
    const r = parseResponse(200, ok(valid));
    expect(r.extraction.total).toBe('23.45');
    expect(r.usage).toEqual({ input: 900, output: 200 });
  });
  it('Zod revalida lo que el proveedor no pudo exigir (formato de monto, fecha)', () => {
    expect(() => parseResponse(200, ok({ ...valid, total: '$23,45' }))).toThrow('Respuesta sin datos válidos');
    expect(() => parseResponse(200, ok({ ...valid, date: '27/11/2026' }))).toThrow('Respuesta sin datos válidos');
  });
  it('errores del servicio, rechazos y respuestas que no son JSON', () => {
    expect(() => parseResponse(404, { error: { message: 'No endpoints found matching your data policy' } })).toThrow(/404.*data policy/);
    expect(() => parseResponse(200, { choices: [{ message: { refusal: 'no' } }] })).toThrow('no procesó');
    expect(() => parseResponse(200, { choices: [{ finish_reason: 'length', message: { content: '' } }] })).toThrow(/length/);
    expect(() => parseResponse(200, { choices: [{ message: { content: 'hola' } }] })).toThrow('no es JSON');
  });
  it('openRouterExtract llama a la URL con la clave y devuelve la extracción', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fake = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify(ok(valid)), { status: 200 });
    }) as unknown as typeof fetch;
    const r = await openRouterExtract({ apiKey: 'sk-or-test', model: 'm', system: 's', fetchImpl: fake }, { ocrText: 'x' });
    expect(r.extraction.merchant).toBe('Súper 99');
    expect(calls[0].url).toBe(OPENROUTER_URL);
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBe('Bearer sk-or-test');
  });
});

describe('elección de proveedor', () => {
  const both = { anthropic: 'sk-ant', openrouter: 'sk-or' };
  it('auto: Anthropic si hay clave, si no OpenRouter, si no ninguno', () => {
    expect(resolveProvider('auto', both)).toBe('anthropic');
    expect(resolveProvider('auto', { anthropic: '', openrouter: 'sk-or' })).toBe('openrouter');
    expect(resolveProvider('auto', { anthropic: '', openrouter: '' })).toBeNull();
  });
  it('forzado: solo si está su clave', () => {
    expect(resolveProvider('openrouter', both)).toBe('openrouter');
    expect(resolveProvider('anthropic', { anthropic: '', openrouter: 'sk-or' })).toBeNull();
  });
});
