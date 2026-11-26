import type { Transaction } from '../transactions/transaction.model';
import { estimateStatement, upcomingInstallments } from './card-statement';
import type { InstallmentPlan } from './installments.service';

const card = { id: 'visa', closingDay: 25, dueDay: 5 };
let seq = 0;
const tx = (type: Transaction['type'], amount: string, date: string, extra: Partial<Transaction> = {}): Transaction => ({
  id: `t${++seq}`,
  accountId: 'visa',
  categoryId: null,
  type,
  amount,
  date,
  status: 'CLEARED',
  transferGroupId: null,
  createdById: 'u',
  revision: '1',
  description: '',
  notes: null,
  ...extra,
});
const plan: InstallmentPlan = {
  id: 'p',
  creditCardId: 'visa',
  transactionId: 'tp',
  installmentsCount: 3,
  interestFree: true,
  totalAmount: '90000',
  installmentAmount: '30000',
  installments: ['2026-11-01', '2026-12-01', '2027-01-01'].map((dueMonth, i) => ({ id: `i${i}`, number: i + 1, dueMonth, amount: '30000' })),
};

describe('resumen estimado de tarjeta', () => {
  it('consumos del ciclo + cuota del mes, menos pagos posteriores al cierre', () => {
    const txs = [
      tx('EXPENSE', '10000', '2026-10-26'), // primer día del ciclo
      tx('EXPENSE', '5000', '2026-11-25'), // día de cierre
      tx('EXPENSE', '7000', '2026-11-26'), // ya es del resumen siguiente
      tx('EXPENSE', '90000', '2026-11-20', { installmentPlanId: 'p' }), // compra en cuotas: no suma el total
      tx('TRANSFER_IN', '20000', '2026-12-03'), // pago del resumen
      tx('EXPENSE', '1', '2026-10-25', { accountId: 'otra' }),
    ];
    expect(estimateStatement(card, '2026-11', txs, [plan])).toMatchObject({
      cycle: { start: '2026-10-26', closing: '2026-11-25', due: '2026-12-05' },
      charges: '15000',
      installments: '30000',
      total: '45000',
      paid: '20000',
      due: '25000',
    });
  });

  it('sobrepago: lo adeudado no queda negativo', () => {
    expect(estimateStatement(card, '2026-11', [tx('TRANSFER_IN', '99999', '2026-12-01')], []).due).toBe('0');
  });

  it('cuotas comprometidas de los próximos meses', () => {
    expect(upcomingInstallments('visa', '2026-11', [plan])).toEqual([
      { month: '2026-12', amount: '30000' },
      { month: '2027-01', amount: '30000' },
      { month: '2027-02', amount: '0' },
    ]);
  });
});
