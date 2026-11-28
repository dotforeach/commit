import { Component, computed, DestroyRef, inject, isDevMode, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AccountService } from './core/auth/account.service';
import { AuthService } from './core/auth/auth.service';
import { SessionService } from './core/session/session.service';
import { AutoLockService } from './core/crypto/auto-lock.service';
import { KeyVaultService } from './core/crypto/key-vault.service';
import { APP_VERSION } from './core/version';
import { ThemeService } from './core/theme/theme.service';
import { OfflineCacheService } from './core/offline/offline-cache.service';
import { NotificationsBell } from './features/notifications/notifications-bell';
import { BackendWake } from './core/net/wake-retry.interceptor';
import { AppUpdateService } from './core/update/app-update.service';
import { randomTip } from './features/learn/tips';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  primary: boolean;
  /** Solo en el panel "Más" del celular (en escritorio se llega desde Inicio y Deudas). */
  mobileOnly?: boolean;
}

const NAV: NavItem[] = [
  { path: '/inicio', label: 'nav.home', icon: 'home', primary: true },
  { path: '/progreso', label: 'nav.progress', icon: 'insights', primary: false },
  { path: '/movimientos', label: 'nav.transactions', icon: 'swap_horiz', primary: true },
  { path: '/presupuesto', label: 'nav.budget', icon: 'pie_chart', primary: true },
  { path: '/recurrentes', label: 'nav.recurring', icon: 'event_repeat', primary: false },
  { path: '/deudas', label: 'nav.debts', icon: 'credit_card', primary: true },
  { path: '/ahorro', label: 'nav.savings', icon: 'savings', primary: false },
  { path: '/cuentas', label: 'nav.accounts', icon: 'account_balance_wallet', primary: false },
  { path: '/plan', label: 'nav.plan', icon: 'auto_awesome', primary: false, mobileOnly: true },
  { path: '/por-revisar', label: 'nav.review', icon: 'receipt_long', primary: false, mobileOnly: true },
  { path: '/herramientas', label: 'nav.tools', icon: 'calculate', primary: false, mobileOnly: true },
  { path: '/fintech', label: 'nav.fintech', icon: 'rocket_launch', primary: false, mobileOnly: true },
];

@Component({
  host: { '(document:keydown.escape)': 'moreOpen.set(false)' },
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, NotificationsBell, TranslocoDirective],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly vault = inject(KeyVaultService);
  private readonly router = inject(Router);
  /** Se instancia con la app: vigila la inactividad. */
  protected readonly autoLock = inject(AutoLockService);
  readonly cache = inject(OfflineCacheService);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly session = inject(SessionService);
  private readonly account = inject(AccountService);
  protected readonly resent = signal(false);
  protected readonly version = APP_VERSION;
  protected readonly devMode = isDevMode();

  /** Secciones: las principales van fijas en la barra inferior del celular; el resto, en "Más". */
  protected readonly navPrimary = NAV.filter((i) => i.primary);
  protected readonly navSecondary = NAV.filter((i) => !i.primary);
  protected readonly navDesktop = NAV.filter((i) => !i.mobileOnly);
  private readonly url = toSignal(inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd), map((e) => e.urlAfterRedirects)), { initialValue: '' });
  protected readonly moreOpen = signal(false);

  /**
   * Carga visible: mientras se resuelve la primera pantalla (se recupera la sesión) o una
   * navegación tarda más de 400 ms, se muestra "Conectando…" en vez de un espacio vacío.
   * Si el backend estaba dormido (arranque en frío), el texto lo explica.
   */
  protected readonly booted = signal(false);
  protected readonly slowNavigation = signal(false);
  protected readonly longWait = signal(false);
  protected readonly wake = inject(BackendWake);
  /** Un consejo para la espera (cambia en cada carga de la app). */
  protected readonly tip = randomTip();
  protected readonly loading = computed(() => !this.booted() || this.slowNavigation());

  constructor() {
    inject(AppUpdateService).start();
    let slowTimer: ReturnType<typeof setTimeout> | undefined;
    let longTimer: ReturnType<typeof setTimeout> | undefined;
    const clear = () => {
      clearTimeout(slowTimer);
      clearTimeout(longTimer);
      this.slowNavigation.set(false);
      this.longWait.set(false);
    };
    longTimer = setTimeout(() => this.longWait.set(true), 4000);
    const sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        clearTimeout(slowTimer);
        clearTimeout(longTimer);
        slowTimer = setTimeout(() => this.slowNavigation.set(true), 400);
        longTimer = setTimeout(() => this.longWait.set(true), 4000);
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        clear();
        if (e instanceof NavigationEnd) this.booted.set(true);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      clear();
    });
  }
  protected readonly inSecondary = computed(() => this.navSecondary.some((i) => this.url().startsWith(i.path)));

  async resendVerification() {
    await this.account.resendVerification().catch(() => null);
    this.resent.set(true);
  }

  async lock() {
    await this.vault.lock();
    await this.router.navigate(['/desbloquear']);
  }
}
