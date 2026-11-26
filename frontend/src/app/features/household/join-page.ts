import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { KeyVaultService } from '../../core/crypto/key-vault.service';
import { HouseholdService } from './household.service';

/** Aceptar una invitación: el link trae el token de un solo uso. */
@Component({
  selector: 'app-join-page',
  imports: [RouterLink, TranslocoDirective, MatButtonModule, MatCardModule],
  template: `
    <ng-container *transloco="let t; prefix: 'household.join'">
      <section class="page">
        <mat-card appearance="outlined">
          <mat-card-header><mat-card-title>{{ t('title') }}</mat-card-title></mat-card-header>
          <mat-card-content>
            @switch (state()) {
              @case ('ready') {
                <p>{{ t('intro') }}</p>
              }
              @case ('pending') {
                <p data-testid="join-pending">{{ t('pending') }}</p>
                <p>{{ t('fingerprint') }} <strong class="fp" data-testid="join-fingerprint">{{ fingerprint() }}</strong></p>
              }
              @case ('error') {
                <p class="error" role="alert">{{ t('errors.' + error()) }}</p>
              }
            }
          </mat-card-content>
          <mat-card-actions align="end">
            @if (state() === 'ready') {
              <button mat-flat-button (click)="accept()" [disabled]="busy()">{{ t('accept') }}</button>
            } @else {
              <a mat-button routerLink="/inicio">{{ t('home') }}</a>
            }
          </mat-card-actions>
        </mat-card>
      </section>
    </ng-container>
  `,
  styles: `
    .page { max-width: 560px; margin: 32px auto; padding: 0 16px; }
    .fp { font-family: ui-monospace, monospace; }
    .error { color: var(--mat-sys-error); }
  `,
})
export class JoinPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(HouseholdService);
  private readonly vault = inject(KeyVaultService);
  readonly state = signal<'ready' | 'pending' | 'error'>('ready');
  readonly error = signal('generic');
  readonly fingerprint = signal<string | null>(null);
  readonly busy = signal(false);
  private token = '';

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.state.set('error');
      this.error.set('missing');
    }
  }

  async accept() {
    this.busy.set(true);
    try {
      await this.service.accept(this.token);
      this.fingerprint.set(await this.vault.myFingerprint());
      this.state.set('pending');
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      this.error.set(status === 403 ? 'otherEmail' : status === 404 ? 'invalid' : status === 409 ? 'already' : 'generic');
      this.state.set('error');
    } finally {
      this.busy.set(false);
    }
  }
}
