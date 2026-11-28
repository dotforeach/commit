import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { retry, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * El backend escala a cero cuando no se usa: el primer pedido tras un rato lo despierta y
 * tarda 20-30 s. Mientras arranca, el proxy puede responder 502/503/504. Este estado lo usa
 * la app para avisar "despertando el servidor" en vez de mostrar una pantalla vacía.
 */
@Injectable({ providedIn: 'root' })
export class BackendWake {
  /** Pedidos esperando a que el backend despierte. */
  private readonly pending = signal(0);
  readonly waking = () => this.pending() > 0;
  start() {
    this.pending.update((n) => n + 1);
  }
  stop() {
    this.pending.update((n) => Math.max(0, n - 1));
  }
}

/** Esperas entre reintentos (≈ 50 s en total: cubre el arranque en frío). */
export const WAKE_DELAYS_MS = [1000, 2000, 3000, 5000, 8000, 10000, 10000, 10000];

/**
 * 502 y 503: el pedido no llegó al backend (arrancando o reemplazándose): siempre se puede
 * reintentar. 504: puede haber llegado, así que solo se reintenta si es de lectura o el refresh
 * de sesión (que es seguro repetir).
 */
export function shouldRetryWake(error: unknown, method: string, url: string): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;
  if (error.status === 502 || error.status === 503) return true;
  return error.status === 504 && (method === 'GET' || url.endsWith('/api/auth/refresh'));
}

export const wakeRetryInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  const wake = inject(BackendWake);
  let waiting = false;
  return next(req).pipe(
    retry({
      count: WAKE_DELAYS_MS.length,
      delay: (error, attempt) => {
        if (!shouldRetryWake(error, req.method, req.url)) throw error;
        if (!waiting) {
          waiting = true;
          wake.start();
        }
        return timer(WAKE_DELAYS_MS[attempt - 1]);
      },
    }),
    finalize(() => {
      if (waiting) wake.stop();
    }),
  );
};
