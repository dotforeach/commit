import { Injectable } from '@angular/core';
import type { PreloadingStrategy, Route } from '@angular/router';
import { of, type Observable } from 'rxjs';

/** Precarga solo las rutas marcadas con data.preload (p. ej. Desbloquear, para que funcione offline). */
@Injectable({ providedIn: 'root' })
export class SelectivePreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
