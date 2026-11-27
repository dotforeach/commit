import { z } from 'zod';

/**
 * Lo que la IA extrae de una factura. Categorías y medios de pago son GENÉRICOS: el cruce con
 * las cuentas y categorías propias (cifradas) lo hace el navegador.
 */
export const GENERIC_CATEGORIES = [
  'groceries',
  'restaurants',
  'transport',
  'fuel',
  'utilities',
  'rent',
  'health',
  'education',
  'entertainment',
  'subscriptions',
  'shopping',
  'travel',
  'insurance',
  'taxes',
  'debt_payment',
  'other',
] as const;

const money = z.string().regex(/^\d{1,13}(\.\d{1,2})?$/).describe('Monto como decimal con punto, sin símbolo ni separador de miles. Ej.: "1234.50"');

export const receiptExtractionSchema = z.object({
  documentType: z.enum(['purchase', 'loan_payment', 'card_statement', 'bill', 'other']),
  merchant: z.string().nullable().describe('Nombre comercial del comercio o entidad'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().describe('Fecha del documento, AAAA-MM-DD'),
  total: money.nullable(),
  currency: z.string().regex(/^[A-Z]{3}$/).nullable().describe('ISO 4217. En Panamá, USD (el balboa B/. equivale a USD)'),
  tax: money.nullable().describe('ITBMS u otro impuesto incluido'),
  paymentMethod: z.enum(['cash', 'debit_card', 'credit_card', 'transfer', 'digital_wallet', 'other']).nullable(),
  cardLast4: z.string().regex(/^\d{4}$/).nullable().describe('Últimos 4 dígitos de la tarjeta, si aparecen'),
  category: z.enum(GENERIC_CATEGORIES),
  items: z.array(z.object({ description: z.string(), amount: money.nullable() })).max(30),
  statement: z
    .object({ totalDue: money.nullable(), minimumPayment: money.nullable(), dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable() })
    .nullable()
    .describe('Solo si es un estado de cuenta de tarjeta o préstamo'),
  confidence: z.number().min(0).max(1).describe('Qué tan seguro estás de los datos principales (total, fecha, comercio)'),
  notes: z.string().nullable().describe('Algo que la persona deba revisar, en español y en una frase'),
});
export type ReceiptExtraction = z.infer<typeof receiptExtractionSchema>;
