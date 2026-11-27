import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KeyVaultService } from './key-vault.service';
import { touchSessionActivity } from './session-keys';

const STORAGE_KEY = 'finanzas.autoLockMinutes';
export const AUTO_LOCK_OPTIONS = [5, 15, 30, 60, 0] as const; // 0 = nunca

/**
 * Bloquea la bóveda tras N minutos sin actividad (o con la pestaña oculta ese tiempo):
 * las claves y los datos descifrados se borran de la memoria.
 */
@Injectable({ providedIn: 'root' })
export class AutoLockService {
  private readonly vault = inject(KeyVaultService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);

  readonly minutes = signal<number>(Number(localStorage.getItem(STORAGE_KEY) ?? 15));
  readonly lockedByInactivity = signal(false);
  private lastActivity = Date.now();
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    const touch = () => {
      const now = Date.now();
      // sessionStorage se escribe como mucho cada 5 s
      if (now - this.lastActivity > 5_000) touchSessionActivity(now);
      this.lastActivity = now;
    };
    for (const ev of ['pointerdown', 'keydown', 'wheel', 'touchstart']) this.doc.addEventListener(ev, touch, { passive: true });
    this.doc.addEventListener('visibilitychange', () => {
      if (this.doc.visibilityState === 'visible') this.check();
    });
    effect(() => {
      const unlocked = this.vault.isUnlocked();
      const minutes = this.minutes();
      this.stop();
      if (unlocked && minutes > 0) {
        this.lastActivity = Date.now();
        this.lockedByInactivity.set(false);
        this.zone.runOutsideAngular(() => (this.timer = setInterval(() => this.check(), 15_000)));
      }
    });
  }

  setMinutes(m: number) {
    localStorage.setItem(STORAGE_KEY, String(m));
    this.minutes.set(m);
  }

  private check() {
    const minutes = this.minutes();
    if (!this.vault.isUnlocked() || minutes <= 0) return;
    if (Date.now() - this.lastActivity >= minutes * 60_000) {
      this.zone.run(async () => {
        this.lockedByInactivity.set(true);
        await this.vault.lock();
        await this.router.navigate(['/desbloquear']);
      });
    }
  }

  private stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
