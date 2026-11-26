import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isCrypto: boolean;
}

/** Catálogo público de monedas (se pide una vez por sesión). */
@Injectable({ providedIn: 'root' })
export class CurrenciesService {
  protected readonly http = inject(HttpClient);
  readonly list = httpResource<Currency[]>(() => '/api/currencies', { defaultValue: [] });
  readonly byCode = computed(() => new Map(this.list.value().map((c) => [c.code, c])));

  get(code: string): Currency {
    return this.byCode().get(code) ?? { code, name: code, symbol: code, decimals: 2, isCrypto: false };
  }
}
