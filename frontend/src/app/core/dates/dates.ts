import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/** Fecha local → "YYYY-MM-DD" (sin pasar por UTC: el 26 a la noche sigue siendo el 26). */
export function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DD" → Date local a medianoche. */
export function fromIsoDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayIso = () => toIsoDate(new Date());

/** "YYYY-MM" del mes de una fecha ISO. */
export const monthOf = (iso: string) => iso.slice(0, 7);

/** El adaptador nativo no entiende "26/11/2026": lo interpretamos como día/mes/año. */
@Injectable()
export class EsArDateAdapter extends NativeDateAdapter {
  override parse(value: unknown, parseFormat?: unknown): Date | null {
    if (typeof value === 'string') {
      const m = value.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
      if (m) {
        const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
        const date = new Date(year, Number(m[2]) - 1, Number(m[1]));
        // Rechaza fechas que JS "corrige" (31/02 → 3/3).
        return date.getDate() === Number(m[1]) && date.getMonth() === Number(m[2]) - 1 ? date : this.invalid();
      }
    }
    return super.parse(value, parseFormat);
  }
}
