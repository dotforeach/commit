import { HttpClient } from '@angular/common/http';
import { OfflineCacheService } from '../../core/offline/offline-cache.service';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v7 as uuidv7 } from 'uuid';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';
import { SessionService } from '../../core/session/session.service';
import { Converter, type Quote } from './converter';

interface PublicRateDto {
  base: string;
  quote: string;
  rateType: string;
  provider: string;
  rate: string;
  date: string;
}
interface ManualRateDto {
  id: string;
  base: string;
  quote: string;
  rateType: string;
  date: string;
  payload: string;
  keyVersion: number;
}
export interface ManualRate {
  id: string;
  base: string;
  quote: string;
  rateType: string;
  date: string;
  rate: string;
}

/** Cotizaciones públicas (del servidor) + manuales del hogar (cifradas), y el conversor resultante. */
@Injectable({ providedIn: 'root' })
export class RatesService {
  private readonly offlineCache = inject(OfflineCacheService);
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly session = inject(SessionService);

  readonly publicRates = signal<PublicRateDto[]>([]);
  readonly manualRates = signal<ManualRate[]>([]);
  private loaded = false;

  readonly usdRateType = computed(() => this.hh.household()?.usdRateType ?? 'mep');

  readonly converter = computed(() => {
    const quotes: Quote[] = [
      ...this.publicRates().map((r) => ({ base: r.base, quote: r.quote, rateType: r.rateType, rate: Number(r.rate), date: r.date, source: 'public' as const })),
      ...this.manualRates().map((r) => ({ base: r.base, quote: r.quote, rateType: r.rateType, rate: Number(r.rate), date: r.date, source: 'manual' as const })),
    ];
    return new Converter(quotes, { usdRateType: this.usdRateType() });
  });

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      // Al bloquear o cambiar de hogar, los datos descifrados no quedan en memoria.
      vault.generation();
      untracked(() => {
        this.manualRates.set([]);
        this.loaded = false;
      });
    });
  }

  private url(path: string) {
    return `/api/households/${this.hh.requireHousehold().id}/${path}`;
  }

  async ensureLoaded() {
    if (this.loaded) return;
    const [pub, manual] = await Promise.all([
      this.offlineCache.cached('/api/exchange-rates/latest', () => firstValueFrom(this.http.get<{ items: PublicRateDto[] }>('/api/exchange-rates/latest'))),
      this.offlineCache.cached(this.url('exchange-rates'), () => firstValueFrom(this.http.get<{ items: ManualRateDto[] }>(this.url('exchange-rates')))),
    ]);
    this.publicRates.set(pub.items);
    this.manualRates.set(
      await Promise.all(
        manual.items.map(async (m) => ({ id: m.id, base: m.base, quote: m.quote, rateType: m.rateType, date: m.date, ...(await this.hh.open<{ rate: string }>('household_exchange_rates', m.id, m.payload, m.keyVersion)) })),
      ),
    );
    this.loaded = true;
  }

  async addManual(r: Omit<ManualRate, 'id'>) {
    const id = uuidv7();
    await firstValueFrom(this.http.post(this.url('exchange-rates'), { id, base: r.base, quote: r.quote, rateType: r.rateType, date: r.date, ...(await this.hh.seal('household_exchange_rates', id, { rate: r.rate })) }));
    this.manualRates.update((l) => [{ id, ...r }, ...l]);
  }

  async removeManual(r: ManualRate) {
    await firstValueFrom(this.http.delete(this.url(`exchange-rates/${r.id}`)));
    this.manualRates.update((l) => l.filter((x) => x.id !== r.id));
  }

  async setUsdRateType(usdRateType: string) {
    await firstValueFrom(this.http.put(this.url('settings'), { usdRateType }));
    await this.session.load();
  }
}
