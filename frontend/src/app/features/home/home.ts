import { Component, computed, inject, resource } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import type { HouseholdPayload } from '../../core/api/api.types';
import { AuthService } from '../../core/auth/auth.service';
import { decryptPayload, payloadAad } from '../../core/crypto/aead';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { fromBase64 } from '../../core/crypto/sodium';
import { SessionService } from '../../core/session/session.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly session = inject(SessionService);
  private readonly vault = inject(KeyVaultService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly me = this.session.me;
  readonly displayName = computed(() => this.me()?.user.displayName ?? '');

  /** Nombres de los hogares, descifrados en el navegador con la clave de cada hogar. */
  readonly households = resource({
    params: () => this.me() ?? undefined, // undefined: el resource espera hasta tener sesión
    loader: async ({ params: me }) =>
      Promise.all(
        me.households
          .filter((h) => h.status === 'ACTIVE')
          .map(async (h) => {
            const payload = await decryptPayload<HouseholdPayload>(
              await fromBase64(h.payload),
              this.vault.householdKey(h.id, h.keyVersion),
              payloadAad('households', h.id, h.id, h.keyVersion),
            );
            return { id: h.id, name: payload.name, baseCurrency: h.baseCurrency, role: h.role };
          }),
      ),
  });

  async logout() {
    await this.vault.lock();
    await this.auth.logout();
    this.session.clear();
    await this.router.navigate(['/ingresar']);
  }
}
