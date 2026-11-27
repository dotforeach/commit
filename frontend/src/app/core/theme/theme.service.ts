import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';
const KEY = 'commit.theme';

/**
 * Modo claro/oscuro. "Sistema" sigue la preferencia del dispositivo. Material genera ambas
 * paletas desde el mismo tema (mismos colores y tipografía); acá solo se fija color-scheme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly systemDark = signal(this.media?.matches ?? false);

  readonly preference = signal<ThemePreference>(this.read());
  /** Si en este momento se ve oscuro (para el ícono del botón). */
  readonly isDark = computed(() => this.preference() === 'dark' || (this.preference() === 'system' && this.systemDark()));

  constructor() {
    this.media?.addEventListener('change', (e) => this.systemDark.set(e.matches));
    effect(() => {
      const p = this.preference();
      const root = this.doc.documentElement;
      if (p === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', p);
    });
  }

  set(p: ThemePreference) {
    if (p === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, p);
    this.preference.set(p);
  }

  /** Botón de la barra: Sistema → Claro → Oscuro → Sistema. */
  cycle() {
    const next: Record<ThemePreference, ThemePreference> = { system: 'light', light: 'dark', dark: 'system' };
    this.set(next[this.preference()]);
  }

  /** Ícono del modo actual. */
  readonly icon = computed(() => ({ system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' })[this.preference()]);

  private read(): ThemePreference {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch {
      return 'system';
    }
  }
}
