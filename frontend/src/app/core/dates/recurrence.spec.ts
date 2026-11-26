import { dueOccurrences, firstOccurrence, nextOccurrence, type RecurrenceRule } from './recurrence';

const monthly = (dayOfMonth: number, startDate = '2026-01-01', endDate: string | null = null): RecurrenceRule => ({
  frequency: 'MONTHLY',
  interval: 1,
  dayOfMonth,
  startDate,
  endDate,
});

describe('recurrencias', () => {
  it('mensual el 31: cae el último día en meses cortos y vuelve al 31', () => {
    const rule = monthly(31);
    const dates = ['2026-01-31'];
    for (let i = 0; i < 4; i++) dates.push(nextOccurrence(rule, dates.at(-1)!));
    expect(dates).toEqual(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31']);
  });

  it('29 de febrero en años bisiestos', () => {
    expect(nextOccurrence(monthly(30), '2028-01-30')).toBe('2028-02-29');
    const yearly: RecurrenceRule = { frequency: 'YEARLY', interval: 1, dayOfMonth: null, startDate: '2028-02-29', endDate: null };
    expect(nextOccurrence(yearly, '2028-02-29')).toBe('2029-02-28');
    expect(nextOccurrence(yearly, '2031-02-28')).toBe('2032-02-29');
  });

  it('primera ocurrencia: este mes si el día no pasó, si no el próximo', () => {
    expect(firstOccurrence(monthly(5, '2026-11-03'))).toBe('2026-11-05');
    expect(firstOccurrence(monthly(5, '2026-11-26'))).toBe('2026-12-05');
    expect(firstOccurrence(monthly(31, '2026-02-10'))).toBe('2026-02-28');
  });

  it('semanal, diaria y cada N meses (cruza de año)', () => {
    expect(nextOccurrence({ frequency: 'WEEKLY', interval: 2, dayOfMonth: null, startDate: '2026-12-25', endDate: null }, '2026-12-25')).toBe('2027-01-08');
    expect(nextOccurrence({ frequency: 'DAILY', interval: 1, dayOfMonth: null, startDate: '2026-12-31', endDate: null }, '2026-12-31')).toBe('2027-01-01');
    expect(nextOccurrence({ ...monthly(15), interval: 3 }, '2026-11-15')).toBe('2027-02-15');
  });

  it('se pone al día con lo vencido y respeta la fecha de fin', () => {
    expect(dueOccurrences(monthly(5), '2026-09-05', '2026-11-26')).toEqual({
      dates: ['2026-09-05', '2026-10-05', '2026-11-05'],
      next: '2026-12-05',
      finished: false,
    });
    expect(dueOccurrences(monthly(5, '2026-01-01', '2026-10-31'), '2026-09-05', '2026-11-26')).toEqual({
      dates: ['2026-09-05', '2026-10-05'],
      next: '2026-11-05',
      finished: true,
    });
    expect(dueOccurrences(monthly(5), '2026-12-05', '2026-11-26').dates).toEqual([]);
    expect(dueOccurrences({ frequency: 'DAILY', interval: 1, dayOfMonth: null, startDate: '2020-01-01', endDate: null }, '2020-01-01', '2026-11-26').dates).toHaveLength(24);
  });
});
