import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from './core/auth/auth.service';
import { AutoLockService } from './core/crypto/auto-lock.service';
import { KeyVaultService } from './core/crypto/key-vault.service';
import { APP_VERSION } from './core/version';
import { OfflineCacheService } from './core/offline/offline-cache.service';
import { NotificationsBell } from './features/notifications/notifications-bell';

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
  protected readonly version = APP_VERSION;

  /** Secciones: las principales van fijas en la barra inferior del celular; el resto, en "Más". */
  protected readonly navPrimary = NAV.filter((i) => i.primary);
  protected readonly navSecondary = NAV.filter((i) => !i.primary);
  protected readonly navDesktop = NAV.filter((i) => !i.mobileOnly);
  private readonly url = toSignal(inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd), map((e) => e.urlAfterRedirects)), { initialValue: '' });
  protected readonly moreOpen = signal(false);
  protected readonly inSecondary = computed(() => this.navSecondary.some((i) => this.url().startsWith(i.path)));

  async lock() {
    await this.vault.lock();
    await this.router.navigate(['/desbloquear']);
  }
}
