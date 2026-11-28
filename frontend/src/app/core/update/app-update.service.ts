import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

const RELOAD_KEY = 'commit.reloadedAt';

/** Recarga una sola vez por minuto (evita bucles si algo sigue fallando tras recargar). */
export function reloadOnce(doc: Document, url?: string): boolean {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  if (Date.now() - last < 60_000) return false;
  sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  if (url) doc.location.assign(url);
  else doc.location.reload();
  return true;
}

/** Un import dinámico (pantalla cargada bajo demanda) que no se pudo descargar. */
export function isChunkLoadError(error: unknown): boolean {
  const msg = String((error as Error)?.message ?? error);
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk/i.test(msg);
}

/**
 * Versiones de la app (PWA). Sin esto, el service worker sigue sirviendo la versión vieja y, si
 * el navegador borró parte de su caché (iOS lo hace), las pantallas cargadas bajo demanda no
 * aparecen y los enlaces no responden.
 *  - Versión nueva lista: se aplica en el próximo cambio de pantalla (recarga completa), nunca
 *    en medio de un formulario.
 *  - Estado irrecuperable: recarga de inmediato.
 *  - Busca versiones al volver a la app y cada 30 minutos.
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  /** Opcional: en tests y sin service worker no existe. */
  private readonly sw = inject(SwUpdate, { optional: true });
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private updateReady = false;

  start() {
    const sw = this.sw;
    if (!sw?.isEnabled) return;
    sw.versionUpdates.pipe(filter((e) => e.type === 'VERSION_READY')).subscribe(() => (this.updateReady = true));
    sw.unrecoverable.subscribe(() => reloadOnce(this.doc));
    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((e) => {
      if (!this.updateReady) return;
      this.updateReady = false;
      void sw.activateUpdate().then(() => reloadOnce(this.doc, (e as NavigationStart).url));
    });
    const check = () => void sw.checkForUpdate().catch(() => false);
    this.doc.addEventListener('visibilitychange', () => this.doc.visibilityState === 'visible' && check());
    setInterval(check, 30 * 60_000);
  }
}
