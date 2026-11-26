import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AutoLockService } from './core/crypto/auto-lock.service';
import { KeyVaultService } from './core/crypto/key-vault.service';
import { OfflineCacheService } from './core/offline/offline-cache.service';
import { NotificationsBell } from './features/notifications/notifications-bell';

@Component({
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

  async lock() {
    await this.vault.lock();
    await this.router.navigate(['/desbloquear']);
  }
}
