import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { DATE_PROVIDERS } from './date-providers';
import { fromIsoDate, toIsoDate } from './dates';

describe('fechas', () => {
  it('ISO ida y vuelta sin corrimientos de zona horaria', () => {
    expect(toIsoDate(new Date(2026, 10, 26, 23, 59))).toBe('2026-11-26');
    expect(toIsoDate(fromIsoDate('2026-01-05'))).toBe('2026-01-05');
  });

  it('interpreta dd/mm/aaaa y rechaza fechas inexistentes', () => {
    TestBed.configureTestingModule({ providers: DATE_PROVIDERS });
    const adapter = TestBed.inject(DateAdapter<Date>);
    expect(toIsoDate(adapter.parse('26/11/2026', null)!)).toBe('2026-11-26');
    expect(toIsoDate(adapter.parse('5-1-26', null)!)).toBe('2026-01-05');
    expect(adapter.isValid(adapter.parse('31/02/2026', null)!)).toBe(false);
  });
});
