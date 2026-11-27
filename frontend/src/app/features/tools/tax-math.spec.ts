import { annualIncomeTax, MAX_ROWS, salaryBreakdown, salaryTable, toPeriod } from './tax-math';

describe('ISR anual (tabla progresiva)', () => {
  it('exento hasta 11,000', () => {
    expect(annualIncomeTax(0)).toBe(0);
    expect(annualIncomeTax(11_000)).toBe(0);
  });
  it('15 % del excedente de 11,000', () => {
    expect(annualIncomeTax(13_000)).toBe(300);
    expect(annualIncomeTax(50_000)).toBe(5_850);
  });
  it('más de 50,000: 5,850 + 25 % del excedente', () => {
    expect(annualIncomeTax(60_000)).toBe(8_350);
  });
});

describe('desglose mensual (valores de la pantalla de referencia)', () => {
  // [salario, neto, total, ISR, SS, SE]
  const expected: [number, number, number, number, number, number][] = [
    [600, 534.0, 66.0, 0, 58.5, 7.5],
    [700, 623.0, 77.0, 0, 68.25, 8.75],
    [800, 712.0, 88.0, 0, 78.0, 10.0],
    [900, 792.92, 107.08, 8.08, 87.75, 11.25],
    [1000, 866.92, 133.08, 23.08, 97.5, 12.5],
    [1100, 940.92, 159.08, 38.08, 107.25, 13.75],
    [1200, 1014.92, 185.08, 53.08, 117.0, 15.0],
    [1300, 1088.92, 211.08, 68.08, 126.75, 16.25],
  ];
  it.each(expected)('$%d', (gross, net, total, isr, ss, se) => {
    const b = salaryBreakdown(gross);
    expect(b).toEqual({ gross, net, totalDeductions: total, incomeTax: isr, socialSecurity: ss, educationInsurance: se });
  });

  it('salario alto: tramo del 25 %', () => {
    // 5,000 × 13 = 65,000 → 5,850 + 25 % × 15,000 = 9,600 al año → 738.46 por pago
    expect(salaryBreakdown(5000).incomeTax).toBe(738.46);
  });

  it('porcentajes editables', () => {
    const b = salaryBreakdown(1000, { socialSecurity: 0.1, educationInsurance: 0 });
    expect(b.socialSecurity).toBe(100);
    expect(b.educationInsurance).toBe(0);
  });
});

describe('quincenal y tabla', () => {
  it('quincenal: la mitad de cada monto', () => {
    const q = toPeriod(salaryBreakdown(1000), 'biweekly');
    expect(q.gross).toBe(500);
    expect(q.incomeTax).toBe(11.54);
    expect(q.net).toBe(433.46);
  });
  it('rango 600 a 2000 cada 100: 15 filas, de 600 a 2000', () => {
    const rows = salaryTable(600, 2000, 100);
    expect(rows).toHaveLength(15);
    expect(rows[0].gross).toBe(600);
    expect(rows.at(-1)!.gross).toBe(2000);
  });
  it('rangos inválidos no generan filas y hay un máximo', () => {
    expect(salaryTable(2000, 600, 100)).toEqual([]);
    expect(salaryTable(600, 2000, 0)).toEqual([]);
    expect(salaryTable(0, 1_000_000, 1)).toHaveLength(MAX_ROWS);
  });
});
