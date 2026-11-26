import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdContextService } from '../../core/households/household-context.service';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface NotificationDto {
  id: string;
  householdId: string | null;
  reminderId: string | null;
  type: string;
  title: string | null;
  body: string | null;
  payload: string | null;
  keyVersion: number | null;
  readAt: string | null;
  createdAt: string;
}

/** Notificaciones de la app (las de recordatorios llegan cifradas) y suscripción Web Push. */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly hh = inject(HouseholdContextService);
  private readonly swPush = inject(SwPush);

  readonly items = signal<AppNotification[]>([]);
  readonly unread = computed(() => this.items().filter((n) => !n.read).length);
  readonly pushSupported = this.swPush.isEnabled;
  readonly pushEnabled = signal(false);

  constructor() {
    const vault = inject(KeyVaultService);
    effect(() => {
      // Al bloquear o cambiar de hogar, los datos descifrados no quedan en memoria.
      vault.generation();
      untracked(() => this.items.set([]));
    });
    if (this.swPush.isEnabled) this.swPush.subscription.subscribe((s) => this.pushEnabled.set(!!s));
  }

  async load() {
    const { items } = await firstValueFrom(this.http.get<{ items: NotificationDto[] }>('/api/me/notifications'));
    const hid = this.hh.household()?.id;
    const decoded = await Promise.all(
      items.map(async (n): Promise<AppNotification | null> => {
        let content = { title: n.title ?? '', body: n.body ?? '', link: null as string | null };
        if (n.payload && n.keyVersion !== null) {
          // Solo se pueden descifrar las del hogar activo (de otros hogares se muestran al cambiar).
          if (n.householdId !== hid) return null;
          try {
            content = await this.hh.open<typeof content>('reminders', n.reminderId ?? n.id, n.payload, n.keyVersion);
          } catch {
            return null;
          }
        }
        return { id: n.id, type: n.type, ...content, read: n.readAt !== null, createdAt: n.createdAt };
      }),
    );
    this.items.set(decoded.filter((x): x is AppNotification => x !== null));
  }

  async markAllRead() {
    await firstValueFrom(this.http.post('/api/me/notifications/read', {}));
    this.items.update((l) => l.map((n) => ({ ...n, read: true })));
  }

  /** Pide permiso al navegador y registra este dispositivo para recibir pushes. */
  async enablePush(): Promise<'enabled' | 'unsupported' | 'denied' | 'unavailable'> {
    if (!this.swPush.isEnabled) return 'unsupported';
    const { publicKey } = await firstValueFrom(this.http.get<{ publicKey: string | null }>('/api/push/public-key'));
    if (!publicKey) return 'unavailable';
    try {
      const sub = await this.swPush.requestSubscription({ serverPublicKey: publicKey });
      await firstValueFrom(this.http.post('/api/me/push-subscriptions', sub.toJSON()));
      return 'enabled';
    } catch {
      return 'denied';
    }
  }

  async disablePush() {
    const sub = await firstValueFrom(this.swPush.subscription);
    if (sub) {
      await firstValueFrom(this.http.post('/api/me/push-subscriptions/remove', { endpoint: sub.endpoint }));
      await sub.unsubscribe();
    }
    this.pushEnabled.set(false);
  }
}
