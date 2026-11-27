import type { Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { EsArDateAdapter } from './dates';

/** Datepicker en español (dd/mm/aaaa). Se registra en las rutas que lo usan, para no inflar el bundle inicial. */
export const DATE_PROVIDERS: Provider[] = [
  { provide: MAT_DATE_LOCALE, useValue: 'es-PA' },
  { provide: DateAdapter, useClass: EsArDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
];
