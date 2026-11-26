import { planReminders } from './reminder-plan';

const t = (key: string, p?: Record<string, unknown>) => `${key}${p ? JSON.stringify(p) : ''}`;

describe('planReminders', () => {
  const base = { today: '2026-11-26', cards: [], debts: [], deposits: [], rules: [] };

  it('tarjeta: 2 días antes del vencimiento, a las 9; no si no hay nada que pagar', () => {
    const r = planReminders({ ...base, cards: [{ id: 'visa', name: 'Visa', due: '2026-12-05', amount: '1000', label: '$ 1.000' }] }, t);
    expect(r).toHaveLength(1);
    expect(r[0].remindAt).toEqual(new Date(2026, 11, 3, 9));
    expect(r[0].body).toContain('05/12/2026');
    expect(planReminders({ ...base, cards: [{ id: 'visa', name: 'Visa', due: '2026-12-05', amount: '0', label: '' }] }, t)).toEqual([]);
  });

  it('deuda: el día anterior al día de pago (este mes o el próximo)', () => {
    const r = planReminders({ ...base, debts: [{ id: 'd', name: 'Préstamo', paymentDay: 10, amount: '$ 5.000' }] }, t);
    expect(r[0].remindAt).toEqual(new Date(2026, 11, 9, 9));
    const later = planReminders({ ...base, debts: [{ id: 'd', name: 'Préstamo', paymentDay: 28, amount: null }] }, t);
    expect(later[0].remindAt).toEqual(new Date(2026, 10, 27, 9));
  });

  it('plazo fijo el día que vence; recurrentes a confirmar; nada fuera del horizonte o en el pasado', () => {
    const r = planReminders(
      {
        ...base,
        deposits: [
          { id: 'pf', name: 'Banco', maturity: '2026-12-01' },
          { id: 'old', name: 'Viejo', maturity: '2026-11-01' },
          { id: 'far', name: 'Lejos', maturity: '2027-06-01' },
        ],
        rules: [{ id: 'luz', name: 'Luz', next: '2026-12-15', following: '2027-01-15' }],
      },
      t,
    );
    expect(r.map((x) => x.sourceId)).toEqual(['pf', 'luz']);
  });
});
