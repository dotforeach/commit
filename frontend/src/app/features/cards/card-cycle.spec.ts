import { cycleFor, installmentMonths, statementMonthOf } from './card-cycle';
import { splitInstallments } from './installments.service';

describe('ciclo de tarjeta', () => {
  it('una compra hasta el cierre entra en el resumen del mes; después, en el siguiente', () => {
    expect(statementMonthOf('2026-11-25', 25)).toBe('2026-11');
    expect(statementMonthOf('2026-11-26', 25)).toBe('2026-12');
    expect(statementMonthOf('2026-12-31', 25)).toBe('2027-01');
    expect(statementMonthOf('2026-02-28', 30)).toBe('2026-02'); // cierre "30" en febrero = 28
  });

  it('ciclo: desde el día siguiente al cierre anterior; vence el primer día de vencimiento posterior', () => {
    expect(cycleFor('2026-11', 25, 5)).toEqual({ month: '2026-11', start: '2026-10-26', closing: '2026-11-25', due: '2026-12-05' });
    expect(cycleFor('2026-03', 3, 20)).toEqual({ month: '2026-03', start: '2026-02-04', closing: '2026-03-03', due: '2026-03-20' });
    expect(cycleFor('2026-03', 31, 10)).toMatchObject({ start: '2026-03-01', closing: '2026-03-31', due: '2026-04-10' });
  });

  it('cuotas: una por resumen desde el de la compra', () => {
    expect(installmentMonths('2026-11-20', 25, 3)).toEqual(['2026-11-01', '2026-12-01', '2027-01-01']);
    expect(installmentMonths('2026-11-28', 25, 2)).toEqual(['2026-12-01', '2027-01-01']);
  });
});


describe('splitInstallments', () => {
  it('cuotas iguales y la última absorbe los centavos', () => {
    expect(splitInstallments('100000', 3)).toEqual(['33333.33', '33333.33', '33333.34']);
    expect(splitInstallments('90', 3)).toEqual(['30', '30', '30']);
    expect(splitInstallments('10.5', 2)).toEqual(['5.25', '5.25']);
  });
});
