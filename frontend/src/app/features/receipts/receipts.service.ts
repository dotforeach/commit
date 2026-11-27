import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { fromBase64 } from '../../core/crypto/sodium';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import type { InboxReceipt, ReceiptExtraction } from './receipt.model';

export interface WhatsappStatus {
  configured: boolean;
  whatsappConfigured: boolean;
  extractionConfigured: boolean;
  ocr: boolean;
  number: string | null;
  linked: boolean;
  linkedAt: string | null;
  subscription: Subscription | null;
  subscriptionRequired: boolean;
  monthlyLimit: number;
  usedThisMonth: number;
}
export interface Subscription {
  plan: 'MONTHLY' | 'YEARLY';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  currentPeriodEnd: string;
}

/** Comprobantes (WhatsApp o subidos desde la app): llegan sellados y se abren en el navegador. */
@Injectable({ providedIn: 'root' })
export class ReceiptsService {
  private readonly http = inject(HttpClient);
  private readonly vault = inject(KeyVaultService);

  readonly items = signal<InboxReceipt[]>([]);
  readonly count = computed(() => this.items().length);
  readonly status = signal<WhatsappStatus | null>(null);

  constructor() {
    effect(() => {
      this.vault.generation();
      untracked(() => this.items.set([]));
    });
  }

  async load() {
    const { items } = await firstValueFrom(this.http.get<{ items: { id: string; sealed: string; createdAt: string }[] }>('/api/me/receipts'));
    const opened = await Promise.all(
      items.map(async (i) => {
        try {
          const json = new TextDecoder().decode(await this.vault.openSealed(await fromBase64(i.sealed)));
          const r = JSON.parse(json) as { source: InboxReceipt['source']; extraction: ReceiptExtraction };
          return { id: i.id, createdAt: i.createdAt, source: r.source, extraction: r.extraction } satisfies InboxReceipt;
        } catch {
          return null; // sellado con otra clave (p. ej. tras resetear las claves): no se puede abrir
        }
      }),
    );
    this.items.set(opened.filter((x): x is InboxReceipt => x !== null));
  }

  async remove(id: string) {
    await firstValueFrom(this.http.delete(`/api/me/receipts/${id}`));
    this.items.update((l) => l.filter((x) => x.id !== id));
  }

  async upload(file: File) {
    const form = new FormData();
    form.append('file', file);
    await firstValueFrom(this.http.post('/api/me/receipts/upload', form));
    await this.load();
  }

  async loadStatus() {
    this.status.set(await firstValueFrom(this.http.get<WhatsappStatus>('/api/me/whatsapp')));
    return this.status()!;
  }

  linkCode() {
    return firstValueFrom(this.http.post<{ code: string; expiresAt: string; waLink: string | null }>('/api/me/whatsapp/link-code', { consent: true }));
  }

  async unlink() {
    await firstValueFrom(this.http.delete('/api/me/whatsapp'));
    await this.loadStatus();
  }

  subscription() {
    return firstValueFrom(this.http.get<{ subscription: Subscription | null; plans: Record<'MONTHLY' | 'YEARLY', { price: number; months: number }> }>('/api/me/subscription'));
  }

  checkout(plan: 'MONTHLY' | 'YEARLY') {
    return firstValueFrom(this.http.post('/api/me/subscription/checkout', { plan }));
  }

  devActivate(plan: 'MONTHLY' | 'YEARLY') {
    return firstValueFrom(this.http.post<Subscription>('/api/me/subscription/dev-activate', { plan }));
  }
}
