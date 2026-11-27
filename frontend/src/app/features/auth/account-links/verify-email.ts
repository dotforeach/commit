import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AccountService } from '../../../core/auth/account.service';
import { SessionService } from '../../../core/session/session.service';

/** Abre el enlace de confirmación (vale también para confirmar un correo nuevo, con mode="change"). */
@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  styleUrl: '../_auth-shared.scss',
  template: `
    <ng-container *transloco="let t; prefix: 'accountLinks'">
      <mat-card class="auth-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ t(mode + '.title') }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @switch (state()) {
            @case ('working') {
              <mat-progress-bar mode="indeterminate" />
            }
            @case ('ok') {
              <p data-testid="link-ok"><mat-icon fontSet="material-symbols-outlined" aria-hidden="true">check_circle</mat-icon> {{ t(mode + '.ok') }}</p>
            }
            @case ('error') {
              <p class="error" role="alert" data-testid="link-error">{{ t('invalid') }}</p>
            }
          }
        </mat-card-content>
        <mat-card-actions align="end">
          <a mat-flat-button routerLink="/inicio">{{ t('goApp') }}</a>
        </mat-card-actions>
      </mat-card>
    </ng-container>
  `,
})
export class VerifyEmailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly account = inject(AccountService);
  private readonly session = inject(SessionService);
  readonly state = signal<'working' | 'ok' | 'error'>('working');
  readonly mode: 'verify' | 'change' = this.route.snapshot.data['mode'] ?? 'verify';

  async ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    try {
      await (this.mode === 'change' ? this.account.confirmEmailChange(token) : this.account.verifyEmail(token));
      this.state.set('ok');
      if (this.session.me()) await this.session.load().catch(() => null); // quita el aviso si está abierta la app
    } catch {
      this.state.set('error');
    }
  }
}
